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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  wispServer: z.string().url("Please provide a valid URL"),
  description: z.string().optional(),
});

export default function ProxyOptions() {
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

  const [proxy, setProxy] = useState("");

  useEffect(() => {
    setProxy(window.chemical.getStore("service"));
  }, []);

  const proxyChanged = (service: string) => {
    setProxy(service);
    window.chemical.setStore("service", service);
  };

  const [searchEngine, setSearchEngine] = useState("");

  useEffect(() => {
    setSearchEngine(
      window.chemical.getStore("searchEngine") ||
        "https://www.google.com/search?q=%s"
    );
  }, []);

  const searchEngineChanged = (service: string) => {
    setSearchEngine(service);
    window.chemical.setStore("searchEngine", service);
  };

  const [transport, setTransport] = useState("");

  useEffect(() => {
    setTransport(window.chemical.getStore("transport"));
  }, []);

  const transportChanged = (service: string) => {
    setTransport(service);
    window.chemical.setStore("transport", service);
  };

  return (
    <div>
      <h1 className="text-4xl font-semibold">Proxy</h1>
      <Separator />
      <div className="mt-4">
        <p>Proxy Switcher</p>
        <Select value={proxy} onValueChange={proxyChanged}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="uv">Ultraviolet</SelectItem>
              <SelectItem value="rammerhead">Rammerhead</SelectItem>
              <SelectItem value="scramjet">
                Scramjet (Beta)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p>Transport</p>
        <Select value={transport} onValueChange={transportChanged}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="libcurl">Libcurl</SelectItem>
              <SelectItem value="epoxy">Epoxy</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p>Search Engine</p>
        <Select value={searchEngine} onValueChange={searchEngineChanged}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="https://www.google.com/search?q=%s">
                Google
              </SelectItem>
              <SelectItem value="https://duckduckgo.com/?q=%s&ia=web">
                DuckDuckGo
              </SelectItem>
              <SelectItem value="https://www.bing.com/search?q=%s">
                Bing
              </SelectItem>
              <SelectItem value="https://search.yahoo.com/search?p=%s">
                Yahoo
              </SelectItem>
              <SelectItem value="https://search.brave.com/search?q=%s">
                Brave
              </SelectItem>
              <SelectItem value="https://www.qwant.com/?q=%s&t=web">
                Qwant
              </SelectItem>
              <SelectItem value="https://searx.si/search?q=%s">
                SearXNG
              </SelectItem>
              <SelectItem value="https://www.ecosia.org/search?method=index&q=%s">
                Ecosia
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
