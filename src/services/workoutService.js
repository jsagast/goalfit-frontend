const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/workouts`;

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        return res.json();
    } catch (err) {
        console.log(err)
    }
};

const show = async (workoutId) => {
    try {
        const res = await fetch(`${BASE_URL}/${workoutId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        return res.json();
    } catch (err) {
        console.log(err);
    }
}

const create = async (payload) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return res.json();
    } catch (err) {
        console.log(err);
    }
};

// const createComment = async (workoutId, commentFormData) => {
//   try {
//     const res = await fetch(`${BASE_URL}/${workoutId}/comments`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(commentFormData),
//     });
//     return res.json();
//   } catch (error) {
//     console.log(error);
//   }
// };


const deleteWorkout = async (workoutId) => {
  try {
    const res = await fetch(`${BASE_URL}/${workoutId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const updateWorkout = async (workoutId, payload) => {
    try {
        const res = await fetch(`${BASE_URL}/${workoutId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return res.json();
    } catch (err) {
        console.log(err)
    };
};

export {
  index,
  show,
  create,
  updateWorkout,
  deleteWorkout
//   createComment,
};


