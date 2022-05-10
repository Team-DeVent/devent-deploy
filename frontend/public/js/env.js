class Env {
    constructor() {
    }

    async get(hash) {

        let response = await fetch(`/api/env/${hash}`, {
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

    async remove(hash) {
        let response = await fetch(`/api/env/${hash}`, {
            method: "DELETE"
        });
    
        let data = response.json();
        return data;
    }

}