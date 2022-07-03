class Volume {
    constructor() {
    }

    async get(hash) {

        let response = await fetch(`/api/volume/${hash}`, {
            method: "GET"
        });
    
        let data = response.json();
        return data;
    }

    async insert(name, volume_name, volume_mount) {
        let response = await fetch("/api/volume", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `name=${name}&volume_name=${volume_name}&volume_mount=${volume_mount}`
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