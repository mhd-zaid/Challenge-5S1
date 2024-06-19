

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

const delete_unavailability = async (token, id) => {
  const response = await fetch(`${url}/unavailability_hours/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

const update_unavailability = async (token, id, formData) => {
  const response = await fetch(`${url}/unavailability_hours/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  return response;
}


export default {
    create_unavailability,
    get_unavailabilities,
    delete_unavailability,
    update_unavailability
};