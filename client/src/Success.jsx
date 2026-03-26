import { Helmet } from "react-helmet-async";

export default function Success() {
  return (
    <div className="text-center mt-20 min-h-[60vh] flex flex-col items-center justify-center">
      <Helmet>
        <title>Order Successful | Kala Agalya Herbals</title>
        <meta name="description" content="Thank you for your order! Your journey to natural hair wellness with Kala Agalya Ayurvedic Hair Oil has begun." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)] mb-6">
        🎉 Order Successful!
      </h1>
      <p className="text-xl text-gray-300 font-light">
        Thank you for purchasing <span className="text-yellow-400 font-medium">Kala Agalya Herbals</span> Ayurvedic Oil.
      </p>
      <p className="mt-2 text-gray-500">
        We are processing your order and will ship it soon.
      </p>
    </div>
  );
}

