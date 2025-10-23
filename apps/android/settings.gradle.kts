rootProject.name = "AllyoWallet"

include(
  ":app",
  ":core-crypto",
  ":core-keystore",
  ":data",
  ":domain",
  ":ui"
)

pluginManagement {
  repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
    maven("https://jitpack.io")
  }
}
