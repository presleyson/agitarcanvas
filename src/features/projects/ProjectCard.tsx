import { Link } from 'react-router';
import { Archive, ArchiveRestore, ArrowRight, CheckCircle2, Copy, LogOut, MoreHorizontal, PencilLine, Trash2, Users } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/Button';
import { Menu, type MenuItem } from '@/components/ui/Menu';
import { MiniCanvas } from '@/components/MiniCanvas';
import { filledBlocks, progressPercent } from '@/domain/progress';
import { ROLE_LABEL, STATUS_LABEL, canEdit, canManage, type ProjectStatus, type ProjectSummary } from '@/domain/types';
import { formatRelative } from '@/lib/dates';
import { BLOCKS, BLOCKS_BY_STEP } from '@/methodology/agitar';
import styles from './ProjectCard.module.css';

export const STATUS_TONE: Record<ProjectStatus, BadgeTone> = {
  draft: 'neutral',
  active: 'primary',
  done: 'success',
};

export type ProjectAction = 'edit' | 'duplicate' | 'archive' | 'unarchive' | 'delete' | 'leave';

interface ProjectCardProps {
  project: ProjectSummary;
  canShare: boolean;
  onAction: (action: ProjectAction, project: ProjectSummary) => void;
}

export function ProjectCard({ project, canShare, onAction }: ProjectCardProps) {
  const filled = filledBlocks(project.noteCounts);
  const percent = progressPercent(project.noteCounts);
  const archived = project.archivedAt !== null;
  /** Primeira etapa sem notas, na ordem de preenchimento recomendada pela metodologia. */
  const next = BLOCKS_BY_STEP.find((block) => (project.noteCounts[block.id] ?? 0) === 0);
  const meta = [project.organization, project.responsible].filter(Boolean).join(' · ');

  const items: MenuItem[] = [];
  if (canEdit(project.role) && !archived) {
    items.push({ label: 'Editar dados', icon: <PencilLine size={16} aria-hidden />, onSelect: () => onAction('edit', project) });
  }
  items.push({ label: 'Duplicar', icon: <Copy size={16} aria-hidden />, onSelect: () => onAction('duplicate', project) });
  if (canManage(project.role)) {
    items.push(
      archived
        ? { label: 'Desarquivar', icon: <ArchiveRestore size={16} aria-hidden />, onSelect: () => onAction('unarchive', project) }
        : { label: 'Arquivar', icon: <Archive size={16} aria-hidden />, onSelect: () => onAction('archive', project) },
      { type: 'separator' },
      { label: 'Excluir', icon: <Trash2 size={16} aria-hidden />, danger: true, onSelect: () => onAction('delete', project) },
    );
  } else if (canShare) {
    items.push(
      { type: 'separator' },
      { label: 'Sair do projeto', icon: <LogOut size={16} aria-hidden />, danger: true, onSelect: () => onAction('leave', project) },
    );
  }

  return (
    <article className={styles.card} data-archived={archived || undefined}>
      <Link to={`/projetos/${project.id}`} className={styles.link} aria-label={`Abrir ${project.name}`}>
        <div className={styles.preview}>
          <MiniCanvas counts={project.noteCounts} />
        </div>

        <div className={styles.body}>
          <div className={styles.badges}>
            {archived ? <Badge tone="warning">Arquivado</Badge> : <Badge tone={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</Badge>}
            {project.role !== 'owner' && <Badge>{ROLE_LABEL[project.role]}</Badge>}
          </div>
          <h2 className={styles.name}>{project.name}</h2>
          {meta && <p className={styles.organization}>{meta}</p>}
          {project.description && <p className={styles.description}>{project.description}</p>}
        </div>

        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            <span>
              {filled} de {BLOCKS.length} blocos preenchidos
            </span>
            <span className={styles.percent}>{percent}%</span>
          </div>
          <div
            className={styles.segments}
            role="progressbar"
            aria-label="Progresso do preenchimento"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
          >
            {BLOCKS_BY_STEP.map((block) => (
              <span
                key={block.id}
                className={styles.segment}
                data-group={block.group}
                data-filled={(project.noteCounts[block.id] ?? 0) > 0 || undefined}
                title={`${block.step} · ${block.title}`}
              />
            ))}
          </div>
        </div>
      </Link>

      {!archived && (
        <div className={styles.nextRow}>
          {next ? (
            <Link
              to={`/projetos/${project.id}?etapa=${next.id}`}
              className={styles.next}
              aria-label={`Continuar ${project.name}: próxima etapa ${next.step}, ${next.title}`}
            >
              <span className={styles.nextLabel}>Próxima etapa</span>
              <span className={styles.nextValue} data-group={next.group}>
                {next.step} · {next.shortTitle}
              </span>
              <ArrowRight size={16} aria-hidden className={styles.nextArrow} />
            </Link>
          ) : (
            <span className={styles.complete}>
              <CheckCircle2 size={16} aria-hidden /> Canvas completo
            </span>
          )}
        </div>
      )}

      <footer className={styles.footer}>
        <span className={styles.meta} title={new Date(project.updatedAt).toLocaleString('pt-BR')}>
          Atualizado {formatRelative(project.updatedAt)}
        </span>
        {project.memberCount > 1 && (
          <span className={styles.meta} title={`${project.memberCount} pessoas com acesso`}>
            <Users size={14} aria-hidden /> {project.memberCount}
          </span>
        )}
        <Menu
          trigger={
            <IconButton label={`Ações do projeto ${project.name}`} size="sm">
              <MoreHorizontal size={18} aria-hidden />
            </IconButton>
          }
          items={items}
        />
      </footer>
    </article>
  );
}
