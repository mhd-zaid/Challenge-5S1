

const url = import.meta.env.VITE_BACKEND_URL;

const create_unavailability = async (token, formData) => {
  const response = await fetch(`${url}/unavailability_hours`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  return response;
};

const get_unavailabilities = async (token) => {
  const response = await fetch(`${url}/unavailability_hours`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  return response;
}


export default {
    create_unavailability,
    get_unavailabilities
};
