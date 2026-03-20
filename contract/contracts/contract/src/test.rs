#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{Env, String};

#[test]
fn test_create_and_read_post() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let author = Address::generate(&env);
    let title = String::from_str(&env, "Hello Soroban");
    let content = String::from_str(&env, "This is my first permissionless post!");

    let post_id = client.create_post(&author, &title, &content);
    assert_eq!(post_id, 1);

    let count = client.get_post_count();
    assert_eq!(count, 1);

    let posts = client.get_posts();
    assert_eq!(posts.len(), 1);

    let post = posts.get(0).unwrap();
    assert_eq!(post.id, 1);
    assert_eq!(post.title, title);
    assert_eq!(post.content, content);
}

#[test]
fn test_multiple_authors() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let charlie = Address::generate(&env);

    client.create_post(
        &alice,
        &String::from_str(&env, "Alice's Post"),
        &String::from_str(&env, "Alice wrote this"),
    );
    client.create_post(
        &bob,
        &String::from_str(&env, "Bob's Post"),
        &String::from_str(&env, "Bob wrote this"),
    );
    let id3 = client.create_post(
        &charlie,
        &String::from_str(&env, "Charlie's Post"),
        &String::from_str(&env, "Charlie wrote this"),
    );

    assert_eq!(id3, 3);
    assert_eq!(client.get_post_count(), 3);

    let posts = client.get_posts();
    assert_eq!(posts.len(), 3);
}

#[test]
fn test_empty_blog() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    assert_eq!(client.get_post_count(), 0);
    let posts = client.get_posts();
    assert_eq!(posts.len(), 0);
}

#[test]
fn test_posts_are_ordered() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    client.create_post(
        &user1,
        &String::from_str(&env, "First"),
        &String::from_str(&env, "First post"),
    );
    client.create_post(
        &user2,
        &String::from_str(&env, "Second"),
        &String::from_str(&env, "Second post"),
    );

    let posts = client.get_posts();
    assert_eq!(posts.get(0).unwrap().title, String::from_str(&env, "First"));
    assert_eq!(
        posts.get(1).unwrap().title,
        String::from_str(&env, "Second")
    );
}
