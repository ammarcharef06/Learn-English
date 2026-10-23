package com.ammarcharef06.learnenglish;

import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import android.app.NotificationManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.TimeUnit;

@CapacitorPlugin(name = "UpdateChecker")
public final class UpdateCheckerPlugin extends Plugin {
    private static final String WORK_NAME = "lea-release-update-check";
    private static final String IMMEDIATE_WORK_NAME = "lea-release-update-check-immediate";

    @PluginMethod
    public void setEnabled(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled");
        if (enabled == null) {
            call.reject("The enabled flag is required.");
            return;
        }
        WorkManager workManager = WorkManager.getInstance(getContext());
        if (enabled) {
            Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build();
            PeriodicWorkRequest request = new PeriodicWorkRequest.Builder(
                UpdateCheckWorker.class, 24, TimeUnit.HOURS
            ).setConstraints(constraints).build();
            OneTimeWorkRequest immediateRequest = new OneTimeWorkRequest.Builder(
                UpdateCheckWorker.class
            ).setConstraints(constraints).build();
            workManager.enqueueUniquePeriodicWork(WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, request);
            workManager.enqueueUniqueWork(IMMEDIATE_WORK_NAME, ExistingWorkPolicy.KEEP, immediateRequest);
        } else {
            workManager.cancelUniqueWork(WORK_NAME);
            workManager.cancelUniqueWork(IMMEDIATE_WORK_NAME);
            NotificationManager notifications = getContext()
                .getSystemService(NotificationManager.class);
            if (notifications != null) notifications.cancel(104);
        }
        JSObject result = new JSObject();
        result.put("enabled", enabled);
        call.resolve(result);
    }
}
