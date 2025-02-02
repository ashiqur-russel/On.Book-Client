import { useEffect, useState } from "react";
import Slider from "react-slick";

// Dynamically import slick-carousel styles only when component is mounted
const loadSlickCarouselCSS = async () => {
  await import("slick-carousel/slick/slick.css");
  await import("slick-carousel/slick/slick-theme.css");
};

const books = [
  {
    id: 1,
    title: "The Stranger",
    description: "A classic novel exploring existentialism.",
  },
  { id: 2, title: "1984", description: "A dystopian novel by George Orwell." },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    description: "A story of racial injustice.",
  },
  {
    id: 4,
    title: "The Great Gatsby",
    description: "A tale of decadence and idealism.",
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    description: "A romantic novel by Jane Austen.",
  },
];

const BookCarousel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadSlickCarouselCSS().then(() => setIsLoaded(true));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (!isLoaded) {
    return <div className="text-center py-10">Loading Carousel...</div>;
  }

  return (
    <div className="container mx-auto px-7 py-10">
      {/* Title Section */}
      <h2 className="text-3xl text-gray-900 mb-3 px-4 pt-10">Featured Books</h2>

      {/* Carousel */}
      <Slider {...settings}>
        {books.map((book) => (
          <div key={book.id} className="px-4">
            <div className="bg-white p-6 shadow-md border hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {book.title}
              </h3>
              <p className="text-gray-600">{book.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BookCarousel;
