const token = localStorage.getItem("token")

async function Call(baseUri, useCase, dtoIn, method) {

    let response;

    try {
        if (!method || method === "get") {
            if (dtoIn) {
                response = await fetch(`${baseUri}/${useCase}?${new URLSearchParams(dtoIn)}`, { headers: { "Authorization": `Bearer ${token}` } }  )
            } else {
                response = await fetch(`${baseUri}/${useCase}`, { headers: { "Authorization": `Bearer ${token}` } } )
            }
        } else {
            console.log( dtoIn )
            response = await fetch(`${baseUri}/${useCase}`,
                {
                    method: method.toUpperCase(),
                    headers: { 
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(dtoIn)
                }
            );
        }

        const data = await response.json();


        return { ok: response.ok, status: response.status, response: data };
    } catch (e) {
        return { ok: false, status: "error" }
    }

}


const baseUri = "http://46.36.39.135:3000/api/v1/";


const FetchHelper = {
    user : {
        register: async (dtoIn) => Call(baseUri, "user/register", dtoIn, "post"),
        token: {
            login: async (dtoIn) => Call(baseUri, "user/token/login", dtoIn, "post"),
        }
    },
    // The way the fetch helper is organised doesnt work as well for the /books requests, since they are the same route, but different request types,
    // for ease of use, the methods are named after their function, rather than the actual called request
    books : {
        get : async (dtoIn, bookId) => Call(baseUri, `books/${bookId}`, dtoIn, "get"),
        create : async (dtoIn) => Call(baseUri, "books", dtoIn, "post"),
        edit : async (dtoIn, bookId) => Call(baseUri, `books/${bookId}`, dtoIn, "patch"),
        delete : async (dtoIn, bookId) => Call(baseUri, `books/${bookId}`, dtoIn, "delete"),
    }
}

export default FetchHelper;