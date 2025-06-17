"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Upload } from "lucide-react";
import Image from "next/image";

export default function EventForm() {
  const [type, setType] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleAddMedia = (
    files: FileList,
    stateSetter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const fileArray = Array.from(files);
    stateSetter((prev) => [...prev, ...fileArray]);
  };

  const handleRemoveMedia = (
    index: number,
    stateSetter: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    stateSetter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg border border-gray-300 shadow-md">
     
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Titre</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
              placeholder="Titre de l’évènement"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Choisir un type</option>
              <option>Concert</option>
              <option>Conférence</option>
              <option>Activité</option>
              <option>Restaurant</option>
              <option>Évènement</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold mb-1">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Heure</label>
            <input
              type="time"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Lieu</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
              placeholder="Casablanca, Maroc"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            rows={4}
            placeholder="Détaillez l'évènement..."
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Nombre de places disponibles
          </label>
          <input
            type="number"
            min={1}
            max={250}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
            placeholder="Ex : 100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Type de participation
          </label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paid"
                className="form-radio"
                onChange={() => setIsPaid(false)}
              />
              <span className="ml-2">Gratuit</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paid"
                className="form-radio"
                onChange={() => setIsPaid(true)}
              />
              <span className="ml-2">Payant</span>
            </label>
          </div>
        </div>

        {isPaid && (
          <div className="space-y-4 border border-gray-200 rounded p-4">
            <h4 className="font-semibold text-lg">Tarifs</h4>
            {["Standard Pass", "VIP Experience", "Golden Pass"].map((label, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-40">{label}</span>
                <input
                  type="number"
                  placeholder="Prix en MAD"
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Upload images */}
        <div>
          <label className="block font-semibold mb-1">Affiches (1 image)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleAddMedia(e.target.files!, setImages)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FF5A1F] file:text-white hover:file:bg-[#e55313]"
          />
          <div className="flex flex-wrap gap-4 mt-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-32 h-32">
                <Image
                  src={URL.createObjectURL(img)}
                  alt="image"
                  fill
                  className="object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(i, setImages)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload video */}
        <div>
          <label className="block font-semibold mb-1">Vidéo de promotion</label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => handleAddMedia(e.target.files!, setVideos)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#FF5A1F] file:text-white hover:file:bg-[#e55313]"
          />
          <div className="flex flex-wrap gap-4 mt-3">
            {videos.map((vid, i) => (
              <div key={i} className="relative w-48 h-28">
                <video
                  src={URL.createObjectURL(vid)}
                  className="object-cover w-full h-full rounded border"
                  controls
                ></video>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(i, setVideos)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <Button className="w-full py-3 bg-[#FF5A1F] hover:bg-[#e55313] text-white font-bold text-lg">
            Créer l’évènement
          </Button>
        </div>
      </form>
    </div>
  );
}
