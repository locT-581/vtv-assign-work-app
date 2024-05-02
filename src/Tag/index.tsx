export interface ITagProps {
  avatar: string;
  content: string;
  backgroundColor?: string;
}

export default function Tag(props: ITagProps) {
  return (
    <div
      className="flex gap-2 items-center justify-center rounded-xl px-[10px] py-[4px]"
      style={{ background: props.backgroundColor }}
    >
      <img src={props.avatar} alt="" className="w-6 h-6 rounded-full" />
      <p>{props.content}</p>
    </div>
  );
}
