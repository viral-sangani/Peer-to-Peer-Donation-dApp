import { ChangeEventHandler } from "react";

interface Props {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  placeholder?: string;
  varient?: "ongray";
}
export const TextArea: React.FC<Props> = ({
  onChange,
  value,
  placeholder,
  varient,
}) => {
  return (
    <textarea
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className="px-3 py-1 font-sourceSansPro text-lg bg-gray-100 hover:bg-white focus:bg-white rounded-lg border-4 hover:border-4 border-transparent hover:border-green-200 focus:border-green-200 outline-none focus:outline-none focus:ring w-full pr-10 transition-all duration-500 ring-transparent"
    />
  );
};
