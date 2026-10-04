export default function Loader({ text = "Loading..." }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 border-4 border-fresh-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
