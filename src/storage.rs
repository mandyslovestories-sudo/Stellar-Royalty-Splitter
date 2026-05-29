//! Typed instance storage accessors (Soroban `#[contracttype]` key pattern).

use soroban_sdk::{Env, IntoVal, TryFromVal, Val};

use crate::StorageKey;

/// Read a value from instance storage.
pub fn instance_get<T>(env: &Env, key: &StorageKey) -> Option<T>
where
    T: TryFromVal<Env, Val> + Clone,
{
    env.storage().instance().get(key)
}

/// Write a value to instance storage.
pub fn instance_set<T>(env: &Env, key: &StorageKey, value: &T)
where
    T: IntoVal<Env, Val> + Clone,
{
    env.storage().instance().set(key, value);
}

/// Returns whether instance storage contains `key`.
pub fn instance_has(env: &Env, key: &StorageKey) -> bool {
    env.storage().instance().has(key)
}
