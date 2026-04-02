import { ArchiveX } from "lucide-react";
import { useAppState } from "../../context/AppStateContext";
import EmptyState from "../common/EmptyState";

function CollectionsPanel() {
  const { filteredCollections } = useAppState();

  if (!filteredCollections.length) {
    return (
      <div className="glass-card p-5">
        <EmptyState
          description="Saved collections matching the current search will appear here."
          icon={ArchiveX}
          title="No collection matches"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {filteredCollections.map((collection) => (
        <div key={collection.id} className="glass-card hover-lift p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-xl font-semibold text-slate-50">{collection.name}</p>
              <p className="mt-1 text-sm text-slate-400">{collection.owner}</p>
            </div>
            <div className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
              {collection.requestCount} requests
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300/74">{collection.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-5 border-t border-white/8 pt-4 text-sm text-slate-400">
            Last updated {collection.lastUpdated}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CollectionsPanel;
