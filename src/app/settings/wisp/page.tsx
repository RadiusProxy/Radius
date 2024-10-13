"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  wispServer: z.string().url("Please provide a valid URL"),
  description: z.string().optional(),
});

export default function WispSwitcher() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wispServer: "",
    },
  });

  useEffect(() => {
    const wispServer: string = window.chemical.getStore("wisp");
    const defaultWisp: string =
      (location.protocol === "https:" ? "wss" : "ws") +
      "://" +
      location.host +
      "/wisp/";
    form.setValue("wispServer", wispServer !== defaultWisp ? wispServer : "");
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    window.chemical.setStore("wisp", values.wispServer);

    setTimeout(() => {
      setSubmitting(false);
      toast.success("Settings saved");
    }, 1000);
  }

  function onReset() {
    form.reset();
    window.chemical.setStore("wisp", "");
    toast("Settings reset");
  }

  return (
    <div>
      <h1 className="text-4xl font-semibold">Wisp</h1>
      <Separator />
      <div className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-1/2 space-y-4"
          >
            <FormField
              control={form.control}
              name="wispServer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wisp Server Switcher</FormLabel>
                  <FormControl>
                    <Input placeholder="Wisp Server URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {}
            <div className="flex space-x-4">
              <Button type="submit" disabled={submitting}>
                <Save className="mr-2 h-5 w-5" /> Save Changes
              </Button>
              <Button type="button" onClick={onReset}>
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
