import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Hash,
  Phone,
  Radio,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Siren,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Child } from "./backend.d";
import {
  useGetAllChildren,
  useRegisterChild,
  useScanChip,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function RegisterTab() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    chipID: "",
    parentPhone: "",
  });
  const [success, setSuccess] = useState(false);
  const { mutate, isPending } = useRegisterChild();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.chipID || !form.parentPhone) {
      toast.error("All fields are required.");
      return;
    }
    mutate(
      {
        name: form.name,
        age: Number(form.age),
        chipID: form.chipID,
        parentPhone: form.parentPhone,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setForm({ name: "", age: "", chipID: "", parentPhone: "" });
          toast.success("Child registered successfully.");
          setTimeout(() => setSuccess(false), 5000);
        },
        onError: () => toast.error("Registration failed. Please try again."),
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">
          Register a Child
        </h2>
        <p className="text-muted-foreground text-sm">
          Add a child to the safety tracking system.
        </p>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            data-ocid="register.success_state"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="mb-6 flex items-center gap-3 p-4 rounded-lg border border-success/30 bg-success/10"
          >
            <CheckCircle2
              className="h-5 w-5 shrink-0"
              style={{ color: "oklch(var(--success))" }}
            />
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "oklch(var(--success))" }}
              >
                Registration Successful
              </p>
              <p className="text-xs text-muted-foreground">
                Child has been added to the tracking system.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="childName"
            className="text-sm font-medium flex items-center gap-2"
          >
            <User className="h-3.5 w-3.5 text-muted-foreground" /> Child Name
          </Label>
          <Input
            id="childName"
            data-ocid="register.input"
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="bg-secondary border-border"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="childAge"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Age
          </Label>
          <Input
            id="childAge"
            data-ocid="register.input"
            type="number"
            placeholder="Enter age"
            min={1}
            max={18}
            value={form.age}
            onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
            className="bg-secondary border-border"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="chipID"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Chip ID
          </Label>
          <Input
            id="chipID"
            data-ocid="register.input"
            placeholder="e.g. CHIP12345"
            value={form.chipID}
            onChange={(e) => setForm((p) => ({ ...p, chipID: e.target.value }))}
            className="bg-secondary border-border font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="parentPhone"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Parent Phone
          </Label>
          <Input
            id="parentPhone"
            data-ocid="register.input"
            placeholder="e.g. 9876543210"
            value={form.parentPhone}
            onChange={(e) =>
              setForm((p) => ({ ...p, parentPhone: e.target.value }))
            }
            className="bg-secondary border-border"
          />
        </div>

        <Button
          data-ocid="register.submit_button"
          type="submit"
          disabled={isPending}
          className="w-full font-semibold h-11"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Registering...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Register Child
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}

function ScanTab() {
  const [chipID, setChipID] = useState("");
  const [result, setResult] = useState<
    { type: "match"; child: Child } | { type: "no-match" } | null
  >(null);
  const { mutate, isPending } = useScanChip();

  const handleScan = () => {
    if (!chipID.trim()) {
      toast.error("Please enter a Chip ID.");
      return;
    }
    setResult(null);
    mutate(chipID.trim(), {
      onSuccess: (child) => setResult({ type: "match", child }),
      onError: () => setResult({ type: "no-match" }),
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">
          Scan Chip ID
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter the chip ID to simulate a QR/chip scan event.
        </p>
      </div>

      {/* Scanner visual */}
      <div className="relative mb-6 rounded-lg border border-border bg-secondary overflow-hidden h-28 flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-x-0 h-8 scan-line" />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <ScanLine className="h-8 w-8 text-primary" />
          <span className="text-xs text-muted-foreground font-mono">
            CHIP SCANNER ACTIVE
          </span>
        </div>
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />
      </div>

      <div className="flex gap-3 mb-6">
        <Input
          data-ocid="scan.input"
          placeholder="Enter Chip ID (e.g. CHIP12345)"
          value={chipID}
          onChange={(e) => setChipID(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          className="bg-secondary border-border font-mono"
        />
        <Button
          data-ocid="scan.button"
          onClick={handleScan}
          disabled={isPending}
          className="shrink-0 px-6"
        >
          {isPending ? (
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              <ScanLine className="h-4 w-4" /> Scan
            </span>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {result?.type === "match" && (
          <motion.div
            data-ocid="scan.success_state"
            key="match"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl border-2 bg-emergency-bg emergency-glow overflow-hidden"
            style={{
              borderColor: "oklch(var(--emergency-border))",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: "oklch(var(--emergency-bg))" }}
            >
              <div className="flex items-center gap-3">
                <div className="emergency-pulse">
                  <Siren
                    className="h-7 w-7"
                    style={{ color: "oklch(var(--emergency))" }}
                  />
                </div>
                <div>
                  <p
                    className="font-display font-bold text-lg"
                    style={{ color: "oklch(var(--emergency))" }}
                  >
                    🚨 EMERGENCY ALERT
                  </p>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "oklch(var(--emergency) / 0.75)" }}
                  >
                    QR SCAN SUCCESSFUL • ALERT TRIGGERED
                  </p>
                </div>
              </div>
              <Badge
                variant="destructive"
                className="text-xs font-mono animate-pulse"
              >
                ACTIVE
              </Badge>
            </div>

            <div
              className="h-px"
              style={{ background: "oklch(var(--emergency-border))" }}
            />

            {/* Alert body */}
            <div className="px-6 py-5 space-y-4">
              <div
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "oklch(var(--emergency) / 0.08)" }}
              >
                <AlertTriangle
                  className="h-5 w-5 shrink-0 emergency-pulse"
                  style={{ color: "oklch(var(--emergency))" }}
                />
                <p
                  className="font-display font-bold text-base"
                  style={{ color: "oklch(var(--emergency))" }}
                >
                  Missing Child Detected!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: "oklch(var(--border))",
                    background: "oklch(var(--card))",
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    Child Name
                  </p>
                  <p className="font-semibold text-foreground">
                    {result.child.name}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg border"
                  style={{
                    borderColor: "oklch(var(--border))",
                    background: "oklch(var(--card))",
                  }}
                >
                  <p className="text-xs text-muted-foreground mb-1">Age</p>
                  <p className="font-semibold text-foreground">
                    {String(result.child.age)} years
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <AlertItem
                  icon={<Radio className="h-4 w-4" />}
                  text="Sending message to Police..."
                  delay={0}
                />
                <AlertItem
                  icon={<Users className="h-4 w-4" />}
                  text="Sending message to Public Volunteers..."
                  delay={0.15}
                />
                <AlertItem
                  icon={<Phone className="h-4 w-4" />}
                  text={`Contact Parent: ${result.child.parentPhone}`}
                  delay={0.3}
                  highlight
                />
              </div>
            </div>
          </motion.div>
        )}

        {result?.type === "no-match" && (
          <motion.div
            data-ocid="scan.error_state"
            key="no-match"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/10"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-sm text-destructive">
                Invalid Chip ID!
              </p>
              <p className="text-xs text-muted-foreground">
                No child found matching this chip ID. Please verify and try
                again.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlertItem({
  icon,
  text,
  delay,
  highlight,
}: {
  icon: React.ReactNode;
  text: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 p-3 rounded-lg"
      style={{
        background: highlight
          ? "oklch(var(--emergency) / 0.12)"
          : "oklch(var(--card))",
        border: `1px solid ${highlight ? "oklch(var(--emergency-border) / 0.5)" : "oklch(var(--border))"}`,
        color: highlight
          ? "oklch(var(--emergency))"
          : "oklch(var(--foreground))",
      }}
    >
      <span
        style={{
          color: highlight
            ? "oklch(var(--emergency))"
            : "oklch(var(--muted-foreground))",
        }}
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  );
}

function ChildrenTab() {
  const { data: children, isLoading } = useGetAllChildren();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-20 w-full rounded-lg"
            data-ocid="children.loading_state"
          />
        ))}
      </div>
    );
  }

  if (!children?.length) {
    return (
      <div
        data-ocid="children.empty_state"
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 p-4 rounded-full bg-secondary border border-border">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-lg text-foreground mb-1">
          No Children Registered
        </h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Register a child using the Register tab to see them listed here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            Registered Children
          </h2>
          <p className="text-muted-foreground text-sm">
            {children.length} child{children.length !== 1 ? "ren" : ""} in the
            system.
          </p>
        </div>
        <Badge variant="secondary" className="font-mono">
          {children.length} total
        </Badge>
      </div>

      <div data-ocid="children.list" className="space-y-3">
        {children.map((child, i) => (
          <ChildCard key={child.chipID} child={child} index={i + 1} />
        ))}
      </div>
    </div>
  );
}

function ChildCard({ child, index }: { child: Child; index: number }) {
  const ocid = `children.item.${index}` as const;
  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
        <span
          className="font-display font-bold text-sm"
          style={{ color: "oklch(var(--primary))" }}
        >
          {child.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Name</p>
          <p className="font-semibold text-sm text-foreground">{child.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Age</p>
          <p className="font-semibold text-sm text-foreground">
            {String(child.age)} yrs
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Chip ID</p>
          <p className="font-mono text-sm text-foreground">{child.chipID}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Parent Phone</p>
          <p className="font-semibold text-sm text-foreground">
            {child.parentPhone}
          </p>
        </div>
      </div>
      {child.emergency && (
        <Badge variant="destructive" className="text-xs shrink-0 animate-pulse">
          EMERGENCY
        </Badge>
      )}
    </motion.div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background grid-bg">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "oklch(var(--primary) / 0.15)" }}
              >
                <ShieldAlert
                  className="h-5 w-5"
                  style={{ color: "oklch(var(--primary))" }}
                />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-foreground tracking-tight">
                  SafeTrack
                </span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                  Child Safety System
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">
                System Online
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Tabs defaultValue="register">
            <TabsList className="w-full mb-8 h-12 bg-secondary border border-border">
              <TabsTrigger
                data-ocid="nav.tab"
                value="register"
                className="flex-1 flex items-center gap-2 text-sm"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </TabsTrigger>
              <TabsTrigger
                data-ocid="nav.tab"
                value="scan"
                className="flex-1 flex items-center gap-2 text-sm"
              >
                <ScanLine className="h-4 w-4" />
                <span className="hidden sm:inline">Scan Chip</span>
              </TabsTrigger>
              <TabsTrigger
                data-ocid="nav.tab"
                value="children"
                className="flex-1 flex items-center gap-2 text-sm"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Children</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register">
              <RegisterTab />
            </TabsContent>
            <TabsContent value="scan">
              <ScanTab />
            </TabsContent>
            <TabsContent value="children">
              <ChildrenTab />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-4 w-4"
                style={{ color: "oklch(var(--primary))" }}
              />
              <span className="text-xs text-muted-foreground">
                SafeTrack — Protecting children with technology
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
