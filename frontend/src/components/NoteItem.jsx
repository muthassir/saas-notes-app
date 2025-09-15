// import React from 'react';

// const NoteItem = ({ note, onDelete }) => {
//   return (
//     <div className="border p-2 rounded mb-2 flex justify-between items-center">
//       <div>
//         <h2 className="font-bold">{note.title}</h2>
//         <p>{note.content}</p>
//       </div>
//       <button onClick={() => onDelete(note._id)} className="text-red-500">Delete</button>
//     </div>
//   );
// };

// export default NoteItem;



import React from 'react';

const NoteItem = ({ note, onDelete }) => {
  return (
    <div className="border p-4 rounded mb-2 flex justify-between items-center">
      <div>
        <h3 className="font-bold">{note.title}</h3>
        <p>{note.content}</p>
      </div>
      <button
        onClick={() => onDelete(note._id)}
        className="bg-red-500 text-white p-2 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default NoteItem;

