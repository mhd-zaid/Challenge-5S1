export const apiService = {

    async getAll(token, entity, page){
        page = page || 1;
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${entity}?page=${page}`,
          {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
          });
        return response;
    },

  async updateById(token, entity, id, data){
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${entity}/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/merge-patch+json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
      });
      return response;
  }

    // getUserInfo(instance, id){
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         headers.append("Authorization", `Bearer ${token}`);
    //     }
    //     return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "GET", headers, credentials: 'include'  })
    //       .then((response) => response.json());
    // },
    //
    // create(instance, data){
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         headers.append("Authorization", `Bearer ${token}`);
    //     }
    //     return fetch(`${API_URL_BASE}/${instance}`, { method: "POST", headers, body: JSON.stringify(data), credentials: 'include' })
    //       .then((response) => response.json());
    // },
    //
    // update(instance, id, data){
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         headers.append("Authorization", `Bearer ${token}`);
    //     }
    //     return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "PUT", headers, body: JSON.stringify(data), credentials: 'include' })
    //       .then((response) => response.json());
    // },
    //
    // patch(instance, id, data){
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         headers.append("Authorization", `Bearer ${token}`);
    //     }
    //     return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "PATCH", headers, body: JSON.stringify(data), credentials: 'include' })
    //       .then((response) => response.json());
    // },
    //
    //
    // deleteById(instance, id){
    //     return fetch(`${API_URL_BASE}/${instance}/${id}`, { method: "DELETE", headers })
    //       .then((response) => {
    //           if (response.status === 204 || response.status === 200) {
    //               return { success: true };
    //           } else {
    //               return response.json();
    //           }
    //       });
    // },

}