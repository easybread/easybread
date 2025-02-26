export type PageHeadingProps = {
  text: string;
};

export function PageHeading(props: PageHeadingProps) {
  return (
    <div className="my-4 text-2xl font-bold text-gray-600">{props.text}</div>
  );
}
