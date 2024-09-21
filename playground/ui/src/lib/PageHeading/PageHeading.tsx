export type PageHeadingProps = {
  text: string;
};

export function PageHeading(props: PageHeadingProps) {
  return (
    <div className="text-2xl font-bold mb-4 mt-4 text-gray-600">
      {props.text}
    </div>
  );
}
