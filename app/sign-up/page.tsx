"use client";

import Image from "next/image";
import signInImage from "@/public/images/sign-in-image.jpg";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/lib/firebase"; // fichier de config firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Le nom doit contenir au moins 2 caractères.",
    }),
    email: z.string().email({
      message: "Veuillez entrer une adresse email valide.",
    }),
    password: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });

      console.log("Utilisateur inscrit :", userCredential.user);
      router.push("/"); // Redirection après inscription
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
      console.error(err);
    }
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col">
      {/* Conteneur central limité à 70% avec centrage horizontal */}
      <div className="flex flex-1 w-[70%] mx-auto">
        <div className="w-1/2 flex flex-col items-center justify-center gap-4">
          <div className="w-full max-w-md flex flex-col items-center justify-center gap-4 m-2">
            <h2 className="font-bold text-2xl mt-2">Cas@Event | Inscription</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrer votre nom complet"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrer une adresse email"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Entrer votre mot de passe"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirmer votre mot de passe"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <Button type="submit" className="w-full bg-custom-orange">
                  S&apos;inscrire
                </Button>
              </form>
            </Form>
            <div className="w-full flex flex-col gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">
                    Ou continuer avec
                  </span>
                </div>
              </div>
              <Button className="w-full bg-custom-orange">
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="white"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Continuer avec Google
              </Button>
            </div>
            <p>
              Vous avez déjà un compte ?{" "}
              <Link href="/sign-in">
                <span className="text-sm text-custom-orange font-bold cursor-pointer hover:underline">
                  connectez-vous ici
                </span>
              </Link>
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h3 className="font-bold text-2xl mb-4">Visiteurs & Touristes</h3>
            <p className="text-slate-400 mb-8 text-center">
              Cas@Event est la solution pour découvrir et réserver des activités
              locales sur Casablanca.
            </p>
            <div>
              <Image
                src={signInImage}
                alt="Image de connexion"
                width={536}
                height={728}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-custom-orange py-2 text-white">
        <ul className="flex justify-center items-center gap-6 text-sm">
          <li>
            <Link href="#" className="text-white hover:underline">
              © 2025 Cas@Event
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Confidentialité
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Conditions générales
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Plan du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Fonctionnement du site
            </Link>
          </li>
          <li>
            <Link href="#" className="text-white hover:underline">
              Infos sur l'entreprise
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
