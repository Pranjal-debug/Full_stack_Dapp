#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[contracttype]
pub enum DataKey {
    PostCount,
    Posts,
}

#[contracttype]
#[derive(Clone)]
pub struct Post {
    pub id: u64,
    pub author: Address,
    pub title: String,
    pub content: String,
    pub timestamp: u64,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Anyone can create a post — NO admin, NO approval, NO moderation.
    /// Just sign with your wallet and post!
    pub fn create_post(env: Env, author: Address, title: String, content: String) -> u64 {
        author.require_auth();

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::PostCount)
            .unwrap_or(0);
        count += 1;

        let post = Post {
            id: count,
            author,
            title,
            content,
            timestamp: env.ledger().timestamp(),
        };

        let mut posts: Vec<Post> = env
            .storage()
            .instance()
            .get(&DataKey::Posts)
            .unwrap_or(Vec::new(&env));
        posts.push_back(post);

        env.storage().instance().set(&DataKey::PostCount, &count);
        env.storage().instance().set(&DataKey::Posts, &posts);

        count
    }

    /// Get all posts (newest first based on order added)
    pub fn get_posts(env: Env) -> Vec<Post> {
        env.storage()
            .instance()
            .get(&DataKey::Posts)
            .unwrap_or(Vec::new(&env))
    }

    /// Get total post count
    pub fn get_post_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::PostCount)
            .unwrap_or(0)
    }
}

mod test;
