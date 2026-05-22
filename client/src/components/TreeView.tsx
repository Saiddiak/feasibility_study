import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ChevronDown, ChevronRight, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TreeViewProps {
  studyId: number;
}

interface Option {
  id: number;
  name: string;
  description?: string | null;
  globalScore: string | null;
  globalAdvancement: string | null;
  status: string;
}

interface Post {
  id: number;
  name: string;
  description?: string | null;
  globalScore: string | null;
  advancement: string | null;
}

interface Action {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  advancement: string | null;
  cost: string | null;
}

export default function TreeView({ studyId }: TreeViewProps) {
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  // Queries
  const optionsQuery = trpc.options.list.useQuery({ studyId });
  const postsQuery = trpc.posts.list.useQuery(
    { optionId: 0 },
    { enabled: false }
  );
  const actionsQuery = trpc.actions.list.useQuery(
    { postId: 0 },
    { enabled: false }
  );

  // Mutations
  const createOptionMutation = trpc.options.create.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Option créée');
    },
  });

  const updateOptionMutation = trpc.options.update.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      setEditingId(null);
      toast.success('Option mise à jour');
    },
  });

  const deleteOptionMutation = trpc.options.delete.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Option supprimée');
    },
  });

  const createPostMutation = trpc.posts.create.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Poste créé');
    },
  });

  const updatePostMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      setEditingId(null);
      toast.success('Poste mis à jour');
    },
  });

  const deletePostMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Poste supprimé');
    },
  });

  const createActionMutation = trpc.actions.create.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Action créée');
    },
  });

  const updateActionMutation = trpc.actions.update.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      setEditingId(null);
      toast.success('Action mise à jour');
    },
  });

  const deleteActionMutation = trpc.actions.delete.useMutation({
    onSuccess: () => {
      optionsQuery.refetch();
      toast.success('Action supprimée');
    },
  });

  const toggleOptionExpanded = (optionId: number) => {
    const newSet = new Set(expandedOptions);
    if (newSet.has(optionId)) {
      newSet.delete(optionId);
    } else {
      newSet.add(optionId);
    }
    setExpandedOptions(newSet);
  };

  const togglePostExpanded = (postId: number) => {
    const newSet = new Set(expandedPosts);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
    }
    setExpandedPosts(newSet);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'idea': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      'in_progress': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      'to_review': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      'in_retard': 'bg-red-500/20 text-red-300 border-red-500/50',
      'abandoned': 'bg-gray-500/20 text-gray-300 border-gray-500/50',
      'terminated': 'bg-green-500/20 text-green-300 border-green-500/50',
    };
    return colors[status] || 'bg-muted/20 text-muted-foreground border-muted/50';
  };

  return (
    <div className="blueprint-container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="blueprint-title">Arborescence des Options</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="blueprint-button">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Option
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-accent/30">
            <DialogHeader>
              <DialogTitle className="text-accent">Nouvelle Option</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  id="new-option-name"
                  placeholder="Ex: Solution A"
                  className="blueprint-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  id="new-option-desc"
                  placeholder="Description de l'option"
                  className="blueprint-input"
                />
              </div>
              <Button
                onClick={() => {
                  const nameInput = document.getElementById('new-option-name') as HTMLInputElement;
                  const descInput = document.getElementById('new-option-desc') as HTMLInputElement;
                  if (nameInput.value.trim()) {
                    createOptionMutation.mutate({
                      studyId,
                      name: nameInput.value,
                      description: descInput.value || undefined,
                    });
                    nameInput.value = '';
                    descInput.value = '';
                  }
                }}
                className="blueprint-button w-full"
              >
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {optionsQuery.data?.map((option: Option) => (
          <div key={option.id} className="space-y-2">
            {/* Option Row */}
            <div className="blueprint-card flex items-center gap-3 group hover:bg-accent/5">
              <button
                onClick={() => toggleOptionExpanded(option.id)}
                className="p-1 hover:bg-accent/20 rounded transition-colors"
              >
                {expandedOptions.has(option.id) ? (
                  <ChevronDown className="w-4 h-4 text-accent" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-accent" />
                )}
              </button>

              {editingId === `option-${option.id}` ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => {
                    if (editingValue.trim()) {
                      updateOptionMutation.mutate({
                        optionId: option.id,
                        name: editingValue,
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && editingValue.trim()) {
                      updateOptionMutation.mutate({
                        optionId: option.id,
                        name: editingValue,
                      });
                    }
                  }}
                  autoFocus
                  className="blueprint-input flex-1"
                />
              ) : (
                <div className="flex-1">
                  <div className="font-semibold text-accent">{option.name}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`blueprint-badge ${getStatusColor(option.status)}`}>
                  {option.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  Score: {option.globalScore}
                </span>
                <button
                  onClick={() => {
                    setEditingId(`option-${option.id}`);
                    setEditingValue(option.name);
                  }}
                  className="p-1 hover:bg-accent/20 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground hover:text-accent" />
                </button>
                <button
                  onClick={() => deleteOptionMutation.mutate({ optionId: option.id })}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Expanded Postes */}
            {expandedOptions.has(option.id) && (
              <div className="ml-8 space-y-2 border-l border-accent/30 pl-4">
                {optionsQuery.data && (
                  <PostsList
                    optionId={option.id}
                    expandedPosts={expandedPosts}
                    togglePostExpanded={togglePostExpanded}
                    getStatusColor={getStatusColor}
                    createPostMutation={createPostMutation}
                    updatePostMutation={updatePostMutation}
                    deletePostMutation={deletePostMutation}
                    createActionMutation={createActionMutation}
                    updateActionMutation={updateActionMutation}
                    deleteActionMutation={deleteActionMutation}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    editingValue={editingValue}
                    setEditingValue={setEditingValue}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsList({
  optionId,
  expandedPosts,
  togglePostExpanded,
  getStatusColor,
  createPostMutation,
  updatePostMutation,
  deletePostMutation,
  createActionMutation,
  updateActionMutation,
  deleteActionMutation,
  editingId,
  setEditingId,
  editingValue,
  setEditingValue,
}: any) {
  const postsQuery = trpc.posts.list.useQuery({ optionId });

  return (
    <div className="space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="blueprint-button">
            <Plus className="w-3 h-3 mr-2" />
            Nouveau Poste
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-accent">Nouveau Poste</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                id="new-post-name"
                placeholder="Ex: Poste 1.1"
                className="blueprint-input"
              />
            </div>
            <Button
              onClick={() => {
                const nameInput = document.getElementById('new-post-name') as HTMLInputElement;
                if (nameInput.value.trim()) {
                  createPostMutation.mutate({
                    optionId,
                    name: nameInput.value,
                  });
                  nameInput.value = '';
                }
              }}
              className="blueprint-button w-full"
            >
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {postsQuery.data?.map((post: Post) => (
        <div key={post.id} className="space-y-2">
          <div className="blueprint-card flex items-center gap-3 group hover:bg-accent/5 bg-card/50">
            <button
              onClick={() => togglePostExpanded(post.id)}
              className="p-1 hover:bg-accent/20 rounded transition-colors"
            >
              {expandedPosts.has(post.id) ? (
                <ChevronDown className="w-4 h-4 text-accent" />
              ) : (
                <ChevronRight className="w-4 h-4 text-accent" />
              )}
            </button>

            {editingId === `post-${post.id}` ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => {
                  if (editingValue.trim()) {
                    updatePostMutation.mutate({
                      postId: post.id,
                      name: editingValue,
                    });
                  }
                }}
                autoFocus
                className="blueprint-input flex-1"
              />
            ) : (
              <div className="flex-1">
                <div className="font-medium text-accent">{post.name}</div>
              </div>
            )}

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">
                Score: {post.globalScore}
              </span>
              <button
                onClick={() => {
                  setEditingId(`post-${post.id}`);
                  setEditingValue(post.name);
                }}
                className="p-1 hover:bg-accent/20 rounded transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-accent" />
              </button>
              <button
                onClick={() => deletePostMutation.mutate({ postId: post.id })}
                className="p-1 hover:bg-red-500/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
              </button>
            </div>
          </div>

          {expandedPosts.has(post.id) && (
            <ActionsList
              postId={post.id}
              getStatusColor={getStatusColor}
              createActionMutation={createActionMutation}
              updateActionMutation={updateActionMutation}
              deleteActionMutation={deleteActionMutation}
              editingId={editingId}
              setEditingId={setEditingId}
              editingValue={editingValue}
              setEditingValue={setEditingValue}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ActionsList({
  postId,
  getStatusColor,
  createActionMutation,
  updateActionMutation,
  deleteActionMutation,
  editingId,
  setEditingId,
  editingValue,
  setEditingValue,
}: any) {
  const actionsQuery = trpc.actions.list.useQuery({ postId });

  return (
    <div className="ml-8 space-y-2 border-l border-accent/30 pl-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="blueprint-button">
            <Plus className="w-3 h-3 mr-2" />
            Nouvelle Action
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-accent">Nouvelle Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <Input
                id="new-action-name"
                placeholder="Ex: Analyse faisabilité"
                className="blueprint-input"
              />
            </div>
            <Button
              onClick={() => {
                const nameInput = document.getElementById('new-action-name') as HTMLInputElement;
                if (nameInput.value.trim()) {
                  createActionMutation.mutate({
                    postId,
                    name: nameInput.value,
                  });
                  nameInput.value = '';
                }
              }}
              className="blueprint-button w-full"
            >
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {actionsQuery.data?.map((action: Action) => (
        <div
          key={action.id}
          className="blueprint-card flex items-center gap-3 group hover:bg-accent/5 bg-card/30"
        >
          <div className="w-4" />

          {editingId === `action-${action.id}` ? (
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => {
                if (editingValue.trim()) {
                  updateActionMutation.mutate({
                    actionId: action.id,
                    name: editingValue,
                  });
                }
              }}
              autoFocus
              className="blueprint-input flex-1"
            />
          ) : (
            <div className="flex-1">
              <div className="text-sm font-medium">{action.name}</div>
            </div>
          )}

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className={`blueprint-badge text-xs ${getStatusColor(action.status)}`}>
              {action.status}
            </span>
            <button
              onClick={() => {
                setEditingId(`action-${action.id}`);
                setEditingValue(action.name);
              }}
              className="p-1 hover:bg-accent/20 rounded transition-colors"
            >
              <Edit2 className="w-3 h-3 text-muted-foreground hover:text-accent" />
            </button>
            <button
              onClick={() => deleteActionMutation.mutate({ actionId: action.id })}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
