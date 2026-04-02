import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function Layout() {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Topbar */}
      <Topbar setIsOpen={setIsOpen} />

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Page Content */}
      <div className="p-4 md:ml-64 mt-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>

      </div>

    </div>
  );
}