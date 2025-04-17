interface CourseHeroProps {
  course: {
    id: number;
    name: string;
    description: string;
  }
}

function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="w-full py-20 bg-gradient-to-t from-white to-primary-foreground flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{course.name}</h1>
        <p className="text-lg font-light text-foreground max-w-3xl">{course.description}</p>
      </div>
    </div>
  );
}
export default CourseHero;
