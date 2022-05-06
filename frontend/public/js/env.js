class Env {
    constructor() {
    }

    async get(feed_idx) {

        let response = await fetch(`/api/env/${feed_idx}`, {
            method: "GET"
        });
    
        let data = response.json();
        return data;
    }

    async insert(name, env) {
        let response = await fetch("/api/env", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `name=${name}&env=${env}`
        });
    
        let data = response.json();
        return data;
    }

}