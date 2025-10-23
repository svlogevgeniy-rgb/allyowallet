plugins {
  alias(libs.plugins.android.library)
  alias(libs.plugins.kotlin.android)
}

android {
  namespace = "com.allyowallet.data"
  compileSdk = 34

  defaultConfig {
    minSdk = 26
    targetSdk = 34
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
  kotlinOptions {
    jvmTarget = "17"
  }
}

dependencies {
  implementation(project(":core-keystore"))
  implementation(libs.kotlinx.coroutines)

  implementation(libs.bundles.retrofit)
  implementation(libs.moshi.kotlin)
}
