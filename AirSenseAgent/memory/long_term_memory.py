"""Persistent database layer (MongoDB) representing Long Term Memory."""
import os
import pymongo
import certifi
import logging
from typing import List, Dict, Any, Optional

from config.config import DB_NAME, MONGODB_URI_ENV_KEY

class LongTermMemory:
    def __init__(self):
        self.logger = logging.getLogger("LongTermMemory")
        self.client: Optional[pymongo.MongoClient] = None
        self.db = None
        self._connect()

    def _connect(self):
        uri = os.getenv(MONGODB_URI_ENV_KEY) or os.getenv("MONGO_URI")
        if not uri:
            self.logger.warning("No MongoDB URI found in environment. LTM is disconnected.")
            return
        try:
            self.client = pymongo.MongoClient(uri, tlsCAFile=certifi.where(), maxPoolSize=50)
            self.client.admin.command('ping')
            self.db = self.client[DB_NAME]
            self.logger.info("Successfully connected to Long Term Memory (MongoDB).")
        except Exception as e:
            self.logger.error(f"Failed to connect to MongoDB: {e}")
            self.client = None

    def is_connected(self) -> bool:
        return self.client is not None

    def fetch_recent_snapshots(self, limit: int = 60) -> List[Dict[str, Any]]:
        if not self.is_connected(): return []
        try:
            cursor = self.db.environment_snapshots.find().sort("_id", -1).limit(limit)
            snapshots = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                snapshots.append(doc)
            return snapshots
        except Exception as e:
            self.logger.error(f"Error fetching snapshots: {e}")
            return []

    def fetch_latest_context(self) -> Optional[Dict[str, Any]]:
        snapshots = self.fetch_recent_snapshots(limit=1)
        return snapshots[0] if snapshots else None

    def store_action(self, action_data: Dict[str, Any]) -> None:
        if not self.is_connected(): return
        try:
            self.db.agent_actions.insert_one(action_data)
        except Exception as e:
            self.logger.error(f"Error storing action: {e}")

    def store_reward(self, reward_data: Dict[str, Any]) -> None:
        if not self.is_connected(): return
        try:
            self.db.agent_rewards.insert_one(reward_data)
        except Exception as e:
            self.logger.error(f"Error storing reward: {e}")

    def fetch_recent_rewards(self, limit: int = 10) -> List[float]:
        if not self.is_connected(): return []
        try:
            cursor = self.db.agent_rewards.find({}, {"reward": 1}).sort("timestamp", -1).limit(limit)
            rewards = []
            for doc in cursor:
                r = doc.get("reward")
                if r is not None:
                    rewards.append(float(r))
            return rewards
        except Exception as e:
            self.logger.error(f"Error fetching rewards: {e}")
            return []

    def store_prediction_evaluation(self, eval_data: Dict[str, Any]) -> None:
        if not self.is_connected(): return
        try:
            self.db.prediction_evaluations.insert_one(eval_data)
        except Exception as e:
            self.logger.error(f"Error storing prediction eval: {e}")
