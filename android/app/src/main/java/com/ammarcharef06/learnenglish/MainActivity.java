package com.ammarcharef06.learnenglish;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(UpdateCheckerPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
