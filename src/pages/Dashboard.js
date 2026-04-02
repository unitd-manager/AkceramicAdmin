import { motion } from "framer-motion";
import { FaBox, FaDollarSign, FaShoppingCart } from "react-icons/fa";

export default function Dashboard() {

  const cards = [
    { title: "Products", value: 120, icon: <FaBox /> },
    { title: "Revenue", value: "$5000", icon: <FaDollarSign /> },
    { title: "Orders", value: 45, icon: <FaShoppingCart /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 rounded-2xl shadow-xl 
          bg-white dark:bg-gray-800 flex justify-between items-center"
        >
          <div>
            <h3 className="text-gray-500 dark:text-gray-300">{card.title}</h3>
            <h1 className="text-2xl font-bold dark:text-white">
              {card.value}
            </h1>
          </div>

          <div className="text-3xl text-blue-500">
            {card.icon}
          </div>
        </motion.div>
      ))}

    </div>
  );
}