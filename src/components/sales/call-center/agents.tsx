import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAgent, listAgents } from "./data";

export function CallCenterAgentsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { data: agents } = useSuspenseQuery({ queryKey: ["call-center", "agents"], queryFn: listAgents });
  const mutation = useMutation({
    mutationFn: addAgent,
    onSuccess: () => {
      setName(""); setEmail("");
      queryClient.invalidateQueries({ queryKey: ["call-center"] });
      toast.success("Agent added");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  return <div className="space-y-6">
    <form className="flex flex-wrap items-end gap-4" onSubmit={e => { e.preventDefault(); mutation.mutate({ name, email }); }}>
      <div className="w-full space-y-2 sm:w-64"><Label htmlFor="call-agent-name">Agent name</Label><Input id="call-agent-name" value={name} onChange={e => setName(e.target.value)} required /></div>
      <div className="w-full space-y-2 sm:w-64"><Label htmlFor="call-agent-email">Email</Label><Input id="call-agent-email" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <Button type="submit" disabled={mutation.isPending || !name.trim()}><UserPlus />{mutation.isPending ? "Adding…" : "Add agent"}</Button>
    </form>
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm"><thead className="bg-muted text-muted-foreground"><tr><th className="p-3 text-left">Agent</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Added</th><th className="p-3 text-left">Agent link</th></tr></thead>
        <tbody>{agents.map(agent => <tr key={agent.id} className="border-t border-border"><td className="p-3 font-medium">{agent.full_name}</td><td className="p-3">{agent.email || "—"}</td><td className="p-3">{new Date(agent.created_at).toLocaleDateString()}</td><td className="p-3"><Button type="button" size="sm" variant="outline" onClick={() => { const url = `${window.location.origin}/agent/${agent.id}`; navigator.clipboard.writeText(url).then(() => toast.success("Link copied — send it to " + agent.full_name), () => toast.message(url)); }}><Link2 />Copy link</Button></td></tr>)}
          {!agents.length && <tr><td colSpan={4} className="p-10 text-center text-muted-foreground"><Users className="mx-auto mb-3 size-6" />No agents yet</td></tr>}
        </tbody>
      </table>
    </div>
  </div>;
}