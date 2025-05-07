interface Props {
  label: string;
  type: string;
  id: string;
  ref: React.RefObject<HTMLInputElement | null>;
}
const Input = ({ label, type, id, ref }: Props) => {
  return (
    <div className="flex flex-col rounded-xl justify-center px-5 py-2 m-2 text-xl md:text-2xl bg-[#F3D7D3]">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="text-black font border-transparent focus:outline-0 focus:border-transparent focus:ring-0 opacity-80 bg-transparent"
        ref={ref}
        autoComplete="on"
      />
    </div>
  );
};

export default Input;
