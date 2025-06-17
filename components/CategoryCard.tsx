import Image from "next/image";

interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
}

const CategoryCard = ({ icon, title, description }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-blue-200 rounded-lg p-4 w-full h-full max-sm:w-[300px] max-sm:h-[200px] max-sm:mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Image src={icon} alt={title} width={28} height={28} />
      <h3 className="text-lg text-black">{title}</h3>
      <p className="text-slate-200 text-sm">{description}</p>
    </div>
  );
};

export default CategoryCard;
