from pydantic_settings import BaseSettings

class FeatureFlags(BaseSettings):
    ENABLE_SCENARIOS: bool = True
    ENABLE_DIGITAL_TWIN: bool = True
    ENABLE_ANALYTICS: bool = False
    ENABLE_SHADOW_MODELS: bool = False

    class Config:
        env_prefix = "FF_"
        env_file = ".env"
        extra = "ignore"

feature_flags = FeatureFlags()
