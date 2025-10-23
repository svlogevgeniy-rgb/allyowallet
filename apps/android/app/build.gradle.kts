plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.kotlin.android)
}

android {
  namespace = "com.allyowallet.app"
  compileSdk = 34

  defaultConfig {
    applicationId = "com.allyowallet"
    minSdk = 26
    targetSdk = 34
    versionCode = 1
    versionName = "0.1.0"

    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    manifestPlaceholders["appAuthRedirectScheme"] = "allyo"
  }

  buildTypes {
    getByName("debug") {
      isDebuggable = true
    }
    getByName("release") {
      isMinifyEnabled = false
      proguardFiles(
        getDefaultProguardFile("proguard-android-optimize.txt"),
        "proguard-rules.pro"
      )
    }
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
  kotlinOptions {
    jvmTarget = "17"
    freeCompilerArgs += listOf("-opt-in=kotlin.RequiresOptIn")
  }

  buildFeatures {
    compose = true
  }
  composeOptions {
    kotlinCompilerExtensionVersion = "1.5.15"
  }

  packaging {
    resources {
      excludes += setOf("META-INF/{AL2.0,LGPL2.1}")
    }
  }
}

dependencies {
  implementation(platform(libs.compose.bom))
  implementation(project(":ui"))
  implementation(project(":domain"))
  implementation(project(":data"))
  implementation(project(":core-keystore"))
  implementation(project(":core-crypto"))

  implementation(libs.androidx.core.ktx)
  implementation(libs.androidx.appcompat)
  implementation(libs.androidx.material)
  implementation(libs.androidx.lifecycle.runtime)
  implementation(libs.androidx.activity.compose)
  implementation(libs.androidx.navigation.compose)
  implementation(libs.androidx.paging.compose)
  implementation(libs.androidx.biometric)
  implementation(libs.compose.material3)
  implementation(libs.compose.material.icons)

  implementation(libs.kotlinx.coroutines)
  implementation(libs.appauth)

  debugImplementation("androidx.compose.ui:ui-tooling")
  debugImplementation("androidx.compose.ui:ui-test-manifest")

  androidTestImplementation(platform(libs.compose.bom))
  androidTestImplementation("androidx.compose.ui:ui-test-junit4")
  androidTestImplementation("androidx.test.ext:junit:1.2.1")
  androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")

  testImplementation("junit:junit:4.13.2")
}
