package com.ammarcharef06.learnenglish;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public final class UpdateCheckWorker extends Worker {
    private static final String RELEASES_URL =
        "https://api.github.com/repos/ammarcharef06/Learn-English/releases/latest";
    private static final String CHANNEL_ID = "lea-app-updates";
    private static final String PREFS_NAME = "lea-update-check";
    private static final String LAST_NOTIFIED_VERSION = "last-notified-version";

    public UpdateCheckWorker(@NonNull Context context, @NonNull WorkerParameters parameters) {
        super(context, parameters);
    }

    @NonNull
    @Override
    public Result doWork() {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(RELEASES_URL).openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/vnd.github+json");
            connection.setRequestProperty("X-GitHub-Api-Version", "2022-11-28");
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(15000);
            int status = connection.getResponseCode();
            if (status == 403 || status == 429 || status >= 500) return Result.retry();
            if (status != HttpURLConnection.HTTP_OK) return Result.success();

            StringBuilder json = new StringBuilder();
            try (InputStream stream = connection.getInputStream();
                 BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    json.append(line);
                    if (json.length() > 1024 * 1024) return Result.failure();
                }
            }

            JSONObject release = new JSONObject(json.toString());
            if (release.optBoolean("draft") || release.optBoolean("prerelease")) return Result.success();
            String latest = release.optString("tag_name", "").replaceFirst("(?i)^v", "");
            if (compareVersions(latest, BuildConfig.VERSION_NAME) <= 0
                || !hasAndroidInstaller(release.optJSONArray("assets"))) {
                return Result.success();
            }
            showUpdateNotification(latest);
            return Result.success();
        } catch (IOException error) {
            Log.w("LEAUpdateCheck", "Background release check will retry.", error);
            return Result.retry();
        } catch (Exception error) {
            Log.w("LEAUpdateCheck", "Background release check failed.", error);
            return Result.success();
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private boolean hasAndroidInstaller(JSONArray assets) {
        if (assets == null) return false;
        for (int i = 0; i < assets.length(); i++) {
            JSONObject asset = assets.optJSONObject(i);
            if (asset != null && "Learn-English-Android.apk".equals(asset.optString("name"))
                && asset.optLong("size", 0) > 0) return true;
        }
        return false;
    }

    private int compareVersions(String left, String right) {
        int[] a = parseVersion(left);
        int[] b = parseVersion(right);
        if (a == null || b == null) return 0;
        for (int i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return Integer.compare(a[i], b[i]);
        }
        return 0;
    }

    private int[] parseVersion(String version) {
        String[] parts = version.split("\\.");
        if (parts.length != 3) return null;
        try {
            return new int[] { Integer.parseInt(parts[0]), Integer.parseInt(parts[1]), Integer.parseInt(parts[2]) };
        } catch (NumberFormatException error) {
            return null;
        }
    }

    private void showUpdateNotification(String version) {
        Context context = getApplicationContext();
        if (Build.VERSION.SDK_INT >= 33
            && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED) return;
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null || !manager.areNotificationsEnabled()) return;
        if (version.equals(context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(LAST_NOTIFIED_VERSION, ""))) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "App updates", NotificationManager.IMPORTANCE_DEFAULT
            );
            manager.createNotificationChannel(channel);
        }

        Intent openUpdates = new Intent(Intent.ACTION_VIEW,
            Uri.parse("com.ammarcharef06.learnenglish://updates?version=" + Uri.encode(version)), context, MainActivity.class);
        openUpdates.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(
            context, 104, openUpdates, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        Notification.Builder notification = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            ? new Notification.Builder(context, CHANNEL_ID)
            : new Notification.Builder(context);
        notification.setSmallIcon(R.drawable.ic_stat_notification)
            .setContentTitle("تحديث جديد · New update")
            .setContentText("الإصدار " + version + " متاح · Version available")
            .setContentIntent(contentIntent)
            .setAutoCancel(true);
        manager.notify(104, notification.build());
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
            .putString(LAST_NOTIFIED_VERSION, version).apply();
    }
}
