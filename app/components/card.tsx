import { Link } from '@remix-run/react';
interface Props {
  text: string;
  link: string;
  className?: string;
}
export default function Card({ text, link, className }: Props) {
  return (
    <Link to={link} className={className}>
      <div className="max-w-sm rounded overflow-hidden shadow hover:shadow-lg">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{text}</div>
        </div>
      </div>
    </Link>
  )
}
