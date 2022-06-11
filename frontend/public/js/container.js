class Container {
    constructor() {
    }

    async deploy(git) {

        let response = await fetch(`/api/webhook/deploy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `git=${git}`
        });
    
        let data = response.json();
        return data;
    }
}