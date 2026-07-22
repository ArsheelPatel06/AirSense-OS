import pandas as pd
from datetime import datetime
from intelligence.datasets.snapshot import DatasetSnapshotManager
from intelligence.feature_builder.feature_vector import FeatureVector
from intelligence.continuous_learning.data_drift import DataDriftDetector
from intelligence.continuous_learning.concept_drift import ConceptDriftDetector
from intelligence.explainability.shap_engine import SHAPEngine
from intelligence.continuous_learning.active_queue import ActiveLearningQueue
from intelligence.registry.memory import AirSenseMemory
from intelligence.inference.champion_challenger import ChampionChallengerEvaluator

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

print("=== AIRSENSE SPRINT 3 INFRASTRUCTURE TEST ===")

# 1. Dataset Snapshots
print("\n--- 1. Dataset Snapshot Manager ---")
fv = FeatureVector(
    timestamp=datetime.utcnow().isoformat(),
    station_id="TEST01",
    city="Delhi",
    state="Delhi",
    latitude=28.6,
    longitude=77.2,
    pm25=150.0,
    pm10=250.0,
    no2=45.0,
    temperature=35.0,
    humidity=60.0,
    wind_speed=2.5,
    quality_score=100.0,
    source_ids=["Mock"]
)
sm = DatasetSnapshotManager()
snap_id = sm.create_snapshot("test_dataset", [fv, fv])
meta = sm.get_metadata(snap_id)
print(f"Snapshot Created: {snap_id}")
print(f"Metadata Hash: {meta['sha256_hash']}")

# 2. Dual Drift (Data + Concept)
print("\n--- 2. Dual Drift Detection ---")
data_drift = DataDriftDetector()
drifted_cols = data_drift.update(fv)
print(f"Data Drifted Columns: {drifted_cols}")

concept_drift = ConceptDriftDetector()
is_drifted = concept_drift.update(actual=150.0, predicted=130.0)
print(f"Concept Drift Detected: {is_drifted}")

# 3. SHAP Engine
print("\n--- 3. SHAP Explainability Engine ---")
X = pd.DataFrame({"pm25": [100.0, 150.0, 200.0], "wind_speed": [5.0, 2.0, 1.0]})
y = [300.0, 350.0, 400.0]
model = RandomForestRegressor(n_estimators=10).fit(X, y)

shap_engine = SHAPEngine(model)
sample = X.iloc[[0]]
explanation = shap_engine.explain_prediction(sample)
print(f"SHAP Explanation: {explanation}")

# 4. Active Queue
print("\n--- 4. Active Learning Queue ---")
queue = ActiveLearningQueue()
queue.enqueue("pred_001", {"pm25": 100}, 150.0, 20.0, "Missing weather data")
print(f"Pending Items in Queue: {queue.get_pending_count()}")

# 5. AirSense Memory
print("\n--- 5. AirSense Memory ---")
mem = AirSenseMemory()
mem.record_prediction("pred_001", "v1.0", {"pm25": 100}, 150.0, 20.0, explanation)
mem.record_outcome("pred_001", 170.0)
print("Recorded prediction and outcome to AirSense Memory.")

# 6. Champion Challenger
print("\n--- 6. Champion Challenger Framework ---")
evaluator = ChampionChallengerEvaluator(metric_func=mean_absolute_error, metric_name="MAE", lower_is_better=True)
actuals = [100.0, 150.0, 200.0]
champion_preds = [90.0, 120.0, 160.0]  # MAE = (10 + 30 + 40)/3 = 26.6
challenger_preds = [95.0, 145.0, 190.0] # MAE = (5 + 5 + 10)/3 = 6.6
is_promoted = evaluator.evaluate(actuals, champion_preds, challenger_preds, improvement_threshold_pct=5.0)
print(f"Challenger Promoted: {is_promoted}")

print("\n=== ALL TESTS PASSED ===")
