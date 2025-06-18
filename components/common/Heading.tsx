// Define the props for the Heading component
interface HeadingProps {
  title: string; // The text to display as the heading
  center?: boolean; // Optional: center-align the text if true
  lg?: boolean; // Optional: show heading in large (4xl) size
  md?: boolean; // Optional: show heading in medium (3xl) size
}

// Reusable Heading component
export default function Heading({ title, center, lg, md }: HeadingProps) {
  return (
    // Set alignment: text-center if `center` is true, otherwise text-start
    <div className={center ? "text-center" : "text-start"}>
      {/* Render large heading if `lg` is true */}
      {lg && <h1 className="text-4xl font-bold my-2">{title}</h1>}

      {/* Render medium heading if `md` is true */}
      {md && <h1 className="text-3xl font-bold my-2">{title}</h1>}

      {/* Default to small heading (2xl) if neither `lg` nor `md` is true */}
      {!lg && !md && <h1 className="text-2xl font-bold my-2">{title}</h1>}
    </div>
  );
}
