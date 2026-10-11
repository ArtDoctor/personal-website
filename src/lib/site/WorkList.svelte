<script lang="ts">
	import { projects, type Project } from '$lib/content';
	import ProjectVisual from '$lib/visuals/ProjectVisual.svelte';

	let active = $state(0);

	const href = (project: Project) => (project.page ? `/portfolio/${project.page}` : project.link);
	const number = (i: number) => String(i + 1).padStart(2, '0');
</script>

<div class="work-grid">
	<ol class="work-list">
		{#each projects as project, i}
			<li class:active={active === i}>
				<a
					href={href(project)}
					target={project.page ? undefined : '_blank'}
					rel={project.page ? undefined : 'noopener noreferrer'}
					onpointerenter={() => (active = i)}
					onfocus={() => (active = i)}
				>
					<span class="idx mono">{number(i)}</span>
					<span class="title">{project.title}</span>
					<span class="stack mono">{project.stack}</span>
					<span class="arrow" aria-hidden="true">{project.page ? '→' : '↗'}</span>
					<span class="more">
						<span>
							<span class="thumb plate"><ProjectVisual {project} /></span>
							<span class="desc">{project.description}</span>
							{#if project.page}
								<span class="tag mono">full write-up →</span>
							{/if}
						</span>
					</span>
				</a>
			</li>
		{/each}
	</ol>

	<aside class="viewer" aria-hidden="true">
		<div class="plate">
			{#each projects as project, i}
				<div class="slide" class:on={active === i}>
					<ProjectVisual {project} active={active === i} />
				</div>
			{/each}
		</div>
		<p class="mono">
			<span>{number(active)} / {String(projects.length).padStart(2, '0')}</span>
			<span>{projects[active].page ? 'read more →' : `${projects[active].linkLabel} ↗`}</span>
		</p>
	</aside>
</div>
