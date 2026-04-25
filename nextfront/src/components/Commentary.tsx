"use client";
import { useEffect, useState } from "react";
import { Ball, Innings, Player } from "../../types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Check, ChevronsUpDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsAdmin } from "@/hooks/useIsAdmin";

type InningsState = {
  overNumber: number;
  ballNumber: number;
  batsman: number | null;
  bowler: number | null;
  runs: number;
  wicket: boolean;
  allBatsmen: Player[];
  allBowlers: Player[];
};

const initialState: InningsState = {
  overNumber: 1,
  ballNumber: 1,
  batsman: null,
  bowler: null,
  runs: 0,
  wicket: false,
  allBatsmen: [],
  allBowlers: []
};

export default function Commentary({ innings }: { innings: Innings[] }) {
  const { isAdmin } = useIsAdmin();
  const [inningsState, setInningsState] = useState<{
    [id: number]: InningsState;
  }>({});
  const [loading, setLoading] = useState(false);
  const [openC, setOpenC] = useState<{ [id: number]: boolean }>({});
  const [openB, setOpenB] = useState<{ [id: number]: boolean }>({});

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBall, setEditingBall] = useState<Ball | null>(null);
  const [editInningsId, setEditInningsId] = useState<number | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    overNumber: 1,
    ballNumber: 1,
    runs: 0,
    isWicket: false,
    batsmanId: null as number | null,
    bowlerId: null as number | null,
  });
  const [editOpenBatsman, setEditOpenBatsman] = useState(false);
  const [editOpenBowler, setEditOpenBowler] = useState(false);

  const [players, setPlayers] = useState<Player[]>([])
  useEffect(() => {

  })

  useEffect(() => {
    if (!innings || innings.length === 0) return;

    innings.forEach((inn) => {
      (async () => {
        try {
          // Fetch Batsmen (batting team)
          const batRes = await fetch(
            `http://localhost:8080/teams/full/${inn.battingTeam.team_id}`
          );
          const battingData = await batRes.json();

          // Fetch Bowlers (bowling team)
          const bowlRes = await fetch(
            `http://localhost:8080/teams/full/${inn.bowlingTeam.team_id}`
          );
          const bowlingData = await bowlRes.json();
          // Update innings state
          setInningsState((prev) => ({
            ...prev,
            [inn.innings_id]: {
              ...initialState,
              allBatsmen: battingData.players,
              allBowlers: bowlingData.players,
            },
          }));
        } catch (err) {
          console.error("Error loading players:", err);
        }
      })();
    });
  }, [innings]);

  const getBowlerLabel = (innId: number, playerId: number | null) => {
    if (!playerId) return "Select Bowler...";

    const s = inningsState[innId];
    if (!s) return "Select Bowler...";

    const t = s.allBowlers.find((p) => p.player_id === playerId);

    return t?.player_name || "Select Bowler...";
  };

  const getBatsmanLabel = (innId: number, playerId: number | null) => {
    if (!playerId) return "Select Batsman...";

    const s = inningsState[innId];
    if (!s) return "Select Batsman...";

    const t = s.allBatsmen.find((p) => p.player_id === playerId);

    return t?.player_name || "Select Batsman...";
  };

  // Edit dialog handlers
  const handleEditBall = (ball: Ball, inningsId: number) => {
    setEditingBall(ball);
    setEditInningsId(inningsId);
    setEditFormData({
      overNumber: ball.overNumber,
      ballNumber: ball.ballNumber,
      runs: ball.runs,
      isWicket: ball.wicket,
      batsmanId: ball.batsman.player_id,
      bowlerId: ball.bowler.player_id,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateBall = async () => {
    if (!editingBall) return;

    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/balls/${editingBall.ball_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        console.log("Ball updated successfully");
        setEditDialogOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Error updating ball:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const getEditBatsmanLabel = (playerId: number | null) => {
    if (!playerId || !editInningsId) return "Select Batsman...";
    const state = inningsState[editInningsId];
    if (!state) return "Select Batsman...";
    const player = state.allBatsmen.find((p) => p.player_id === playerId);
    return player?.player_name || "Select Batsman...";
  };

  const getEditBowlerLabel = (playerId: number | null) => {
    if (!playerId || !editInningsId) return "Select Bowler...";
    const state = inningsState[editInningsId];
    if (!state) return "Select Bowler...";
    const player = state.allBowlers.find((p) => p.player_id === playerId);
    return player?.player_name || "Select Bowler...";
  };

  async function handleSubmitBall(inningsId: number) {
    const state = inningsState[inningsId];
    if (!state || state.batsman === null || state.bowler === null) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/balls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          innings: { innings_id: inningsId },
          overNumber: state.overNumber,
          ballNumber: state.ballNumber,
          batsman: { player_id: state.batsman },
          bowler: { player_id: state.bowler },
          runs: state.runs,
          wicket: state.wicket,
        }),
      });

      const data = await res.json();
      console.log("Ball submitted:", data);

      // Reset the inputs for next ball
      setInningsState((prev) => ({
        ...prev,
        [inningsId]: {
          ...prev[inningsId],
          ballNumber: prev[inningsId].ballNumber + 1,
          runs: 0,
          wicket: false,
          batsman: null,
          bowler: null,
        },
      }));
    } catch (err) {
      console.error("Error submitting ball:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!innings || innings.length === 0)
    return (
      <div className="w-full max-w-7xl mx-auto mt-6">
        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-8 text-center">
          <p className="text-zinc-500">No innings data yet</p>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 space-y-6">
      {innings.map((inn) => {
        const state = inningsState[inn.innings_id] || initialState;

        const updateState = (updates: Partial<InningsState>) => {
          setInningsState((prev) => ({
            ...prev,
            [inn.innings_id]: { ...state, ...updates },
          }));
        };

        return (
          <div
            key={inn.innings_id}
            className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                {inn.battingTeam.team_name} Innings
              </h2>
            </div>

            {/* Ball Input Section - Admin Only */}
            {isAdmin && (
              <div className="p-6 bg-zinc-950/50 border-b border-white/5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-500">Current Ball:</span>
                      <span className="text-sm font-bold text-white bg-zinc-900 px-3 py-1 rounded border border-white/10">
                        {state.overNumber}.{state.ballNumber}
                      </span>
                    </div>

                    <div
                      className={`rounded-lg font-bold text-lg flex items-center justify-center px-6 py-2 min-w-[60px] ${state.wicket
                        ? "bg-red-500/20 border-2 border-red-500 text-red-500"
                        : state.runs === 4
                          ? "bg-green-500/20 border-2 border-green-500 text-green-500"
                          : state.runs === 6
                            ? "bg-blue-500/20 border-2 border-blue-500 text-blue-500"
                            : "bg-zinc-800 border-2 border-white/10 text-white"
                        }`}
                    >
                      {state.wicket ? "W" : state.runs}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel className="text-zinc-300 text-sm">Bowler</FieldLabel>
                      <FieldContent>
                        <Popover
                          open={openC[inn.innings_id] || false}
                          onOpenChange={(v) =>
                            setOpenC((prev) => ({ ...prev, [inn.innings_id]: v }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                            >
                              {getBowlerLabel(inn.innings_id, state.bowler)}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                            <Command className="bg-zinc-950 text-white">
                              <CommandInput placeholder="Search bowler..." className="text-white" />
                              <CommandList>
                                <CommandEmpty>No Bowler found.</CommandEmpty>
                                <CommandGroup>
                                  {(state.allBowlers ?? []).map((b) => (
                                    <CommandItem
                                      className="text-white hover:bg-zinc-900"
                                      key={b.player_id}
                                      onSelect={() => {
                                        updateState({
                                          bowler: Number(b.player_id),
                                        });
                                        setOpenC((prev) => ({
                                          ...prev,
                                          [inn.innings_id]: false,
                                        }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          state.bowler === b.player_id
                                            ? "opacity-100 text-orange-500"
                                            : "opacity-0"
                                        )}
                                      />
                                      {b.player_name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel className="text-zinc-300 text-sm">Batsman</FieldLabel>
                      <FieldContent>
                        <Popover
                          open={openB[inn.innings_id] || false}
                          onOpenChange={(v) =>
                            setOpenB((prev) => ({ ...prev, [inn.innings_id]: v }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between bg-zinc-950 border-white/10 text-white hover:bg-zinc-900 hover:border-orange-500/50"
                            >
                              {getBatsmanLabel(inn.innings_id, state.batsman)}
                              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                            <Command className="bg-zinc-950 text-white">
                              <CommandInput placeholder="Search batsman..." className="text-white" />
                              <CommandList>
                                <CommandEmpty>No Batsman found.</CommandEmpty>
                                <CommandGroup>
                                  {(state.allBatsmen ?? []).map((b) => (
                                    <CommandItem
                                      className="text-white hover:bg-zinc-900"
                                      key={b.player_id}
                                      onSelect={() => {
                                        updateState({
                                          batsman: Number(b.player_id),
                                        });
                                        setOpenB((prev) => ({
                                          ...prev,
                                          [inn.innings_id]: false,
                                        }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          state.batsman === b.player_id
                                            ? "opacity-100 text-orange-500"
                                            : "opacity-0"
                                        )}
                                      />
                                      {b.player_name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FieldContent>
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                    <Field>
                      <FieldLabel className="text-zinc-300 text-sm">Runs</FieldLabel>
                      <Input
                        type="number"
                        value={state.runs}
                        onChange={(e) => updateState({ runs: Number(e.target.value) })}
                        className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                        placeholder="0"
                      />
                    </Field>

                    <Field>
                      <FieldLabel className="text-zinc-300 text-sm">Over</FieldLabel>
                      <Input
                        type="number"
                        value={state.overNumber}
                        onChange={(e) =>
                          updateState({ overNumber: Number(e.target.value) })
                        }
                        className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                      />
                    </Field>

                    <Field>
                      <FieldLabel className="text-zinc-300 text-sm">Ball</FieldLabel>
                      <Input
                        type="number"
                        value={state.ballNumber}
                        onChange={(e) =>
                          updateState({ ballNumber: Number(e.target.value) })
                        }
                        className="bg-zinc-950 border-white/10 text-white focus:border-orange-500/50"
                      />
                    </Field>

                    <label className="flex items-center gap-2 p-3 bg-zinc-950 rounded-lg border border-white/10 cursor-pointer hover:border-red-500/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={state.wicket}
                        onChange={(e) => updateState({ wicket: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-zinc-300">Wicket</span>
                    </label>

                    <Button
                      onClick={() => handleSubmitBall(inn.innings_id)}
                      disabled={loading || !state.batsman || !state.bowler}
                      className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit Ball"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Balls History */}
            <div className="p-6">
              {inn.balls && inn.balls.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(
                    inn.balls.reduce((acc: any, ball) => {
                      const over = ball.overNumber;
                      if (!acc[over]) acc[over] = [];
                      acc[over].push(ball);
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([over, balls]: any) => (
                      <div key={over}>
                        {balls.length >= 6 && (
                          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-600/10 border border-orange-500/20 rounded-lg px-6 py-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                                END OF OVER {over}
                              </div>
                              <div className="text-sm text-zinc-400">
                                {balls.reduce(
                                  (sum: number, ball: Ball) => sum + ball.runs,
                                  0
                                )}{" "}
                                runs
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-3">
                          {balls
                            .sort(
                              (a: Ball, b: Ball) =>
                                Number(b.ballNumber) - Number(a.ballNumber)
                            )
                            .map((ball: Ball) => (
                              <div
                                key={ball.ball_id}
                                className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-lg border border-white/5 hover:bg-zinc-900/50 transition-colors"
                              >
                                <div className="text-xs font-mono text-zinc-500 min-w-[40px]">
                                  {`${over}.${ball.ballNumber}`}
                                </div>
                                <div
                                  className={`px-4 py-2 rounded-lg text-sm font-bold min-w-[50px] text-center ${ball.wicket
                                    ? "bg-red-500/20 border border-red-500/50 text-red-500"
                                    : ball.runs === 4
                                      ? "bg-green-500/20 border border-green-500/50 text-green-500"
                                      : ball.runs === 6
                                        ? "bg-blue-500/20 border border-blue-500/50 text-blue-500"
                                        : "bg-zinc-800 border border-white/10 text-white"
                                    }`}
                                >
                                  {ball.wicket ? "W" : ball.runs}
                                </div>
                                <div className="text-sm text-zinc-300 flex-1">
                                  <span className="font-medium text-white">{ball.bowler.player_name}</span>
                                  <span className="text-zinc-500 mx-2">to</span>
                                  <span className="font-medium text-white">{ball.batsman.player_name}</span>
                                </div>
                                {isAdmin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditBall(ball, inn.innings_id)}
                                    className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 italic">
                    No balls recorded yet. Add the first ball above.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Edit Ball Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              Edit Ball Delivery
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update the details of this delivery
            </DialogDescription>
          </DialogHeader>

          {editingBall && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Over Number</FieldLabel>
                  <Input
                    type="number"
                    value={editFormData.overNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, overNumber: Number(e.target.value) })}
                    className="bg-zinc-900 border-white/10 text-white focus:border-orange-500/50"
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Ball Number</FieldLabel>
                  <Input
                    type="number"
                    value={editFormData.ballNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, ballNumber: Number(e.target.value) })}
                    className="bg-zinc-900 border-white/10 text-white focus:border-orange-500/50"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-zinc-300 text-sm">Batsman</FieldLabel>
                <Popover open={editOpenBatsman} onOpenChange={setEditOpenBatsman}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                    >
                      {getEditBatsmanLabel(editFormData.batsmanId)}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                    <Command className="bg-zinc-950 text-white">
                      <CommandInput placeholder="Search batsman..." className="text-white" />
                      <CommandList>
                        <CommandEmpty>No Batsman found.</CommandEmpty>
                        <CommandGroup>
                          {editInningsId && (inningsState[editInningsId]?.allBatsmen ?? []).map((b) => (
                            <CommandItem
                              className="text-white hover:bg-zinc-900"
                              key={b.player_id}
                              onSelect={() => {
                                setEditFormData({ ...editFormData, batsmanId: b.player_id });
                                setEditOpenBatsman(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  editFormData.batsmanId === b.player_id
                                    ? "opacity-100 text-orange-500"
                                    : "opacity-0"
                                )}
                              />
                              {b.player_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel className="text-zinc-300 text-sm">Bowler</FieldLabel>
                <Popover open={editOpenBowler} onOpenChange={setEditOpenBowler}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                    >
                      {getEditBowlerLabel(editFormData.bowlerId)}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-zinc-950 border-white/10">
                    <Command className="bg-zinc-950 text-white">
                      <CommandInput placeholder="Search bowler..." className="text-white" />
                      <CommandList>
                        <CommandEmpty>No Bowler found.</CommandEmpty>
                        <CommandGroup>
                          {editInningsId && (inningsState[editInningsId]?.allBowlers ?? []).map((b) => (
                            <CommandItem
                              className="text-white hover:bg-zinc-900"
                              key={b.player_id}
                              onSelect={() => {
                                setEditFormData({ ...editFormData, bowlerId: b.player_id });
                                setEditOpenBowler(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  editFormData.bowlerId === b.player_id
                                    ? "opacity-100 text-orange-500"
                                    : "opacity-0"
                                )}
                              />
                              {b.player_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-zinc-300 text-sm">Runs</FieldLabel>
                  <Input
                    type="number"
                    value={editFormData.runs}
                    onChange={(e) => setEditFormData({ ...editFormData, runs: Number(e.target.value) })}
                    className="bg-zinc-900 border-white/10 text-white focus:border-orange-500/50"
                  />
                </Field>

                <label className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg border border-white/10 cursor-pointer hover:border-red-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={editFormData.isWicket}
                    onChange={(e) => setEditFormData({ ...editFormData, isWicket: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-zinc-300">Wicket</span>
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="bg-zinc-900 border-white/10 text-white hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBall}
              disabled={editLoading}
              className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 hover:opacity-90 text-white font-bold"
            >
              {editLoading ? "Updating..." : "Update Ball"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
