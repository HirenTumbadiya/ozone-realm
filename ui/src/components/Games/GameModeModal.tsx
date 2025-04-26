"use client";

export default function GameModeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Modal Body</p>
          </div>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
