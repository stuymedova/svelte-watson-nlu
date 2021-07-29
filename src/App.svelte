<script>
	export let urls = [];
	
	import { onMount } from 'svelte';
	import { Link, Grid, Row, Column, Accordion, AccordionItem, Tag, Loading,
		UnorderedList, ListItem, Search } from 'carbon-components-svelte';
	import { format } from 'date-fns';

	let results = [];
	let loading = false;
	let value = '';

	$: {
		results =	results.map((result) => {
			const entitiesByType = {};

			result.entities.forEach((entity) => {
				if(entity.type in entitiesByType) {
					entitiesByType[entity.type] = [
						...entitiesByType[entity.type],
						entity,
					];
				} else {
					entitiesByType[entity.type] = [entity];
				};
			});

			return { ...result, entitiesByType };
		});
	};

	function fetchWatsonNLU() {
		results = [];
		loading = true;

		const api_requests = urls.map((url) => 
			fetch('/api/watson-nlu', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url,
					features: {
						metadata: {},
						concepts: { emotion: true, sentiment: true, limit: 3 },
						keywords: { emotion: true, sentiment: true, limit: 6 },
						entities: { emotion: true, sentiment: true, limit: 9 },
					},
				}),
			})
		);

		Promise.all(api_requests).then(async (api_responses) => {
			for(const response of api_responses) {
				const data = await response.json();
				results = [...results, data];
			};

			loading = false;
		});
	};
	onMount(fetchWatsonNLU);
</script>

<Grid>
	<Row>
		<Column lg={{ span: 8, offset: 4 }}>
			<Search placeholder='Filter concepts, entities, keywords...' bind:value />
		</Column>
	</Row>

	{#if loading}
		<Row>
			<Column lg={{ span: 8, offset: 4 }}>
				<Loading small withOverlay={false} />
			</Column>
		</Row>
	{/if}

	{#if !loading}
		{#each results as result}
			<Row>
				<Column lg={4} md={4}>
					<div>
						<img src={result.metadata.image} alt={result.metadata.title} />
					</div>
					<div style='margin-top: 1rem; margin-bottom: .5rem;'>
						<Link href={result.retrieved_url} target='_blank'>Article URL</Link>
						<time>{format(new Date(result.metadata.publication_date), 'MM/dd/yyyy')}</time>
					</div>
					<h4 style='margin-bottom: 1rem;'>{result.metadata.title}</h4>
					<div>
						{result.metadata.authors.map((author) => author.name).join(', ')}
					</div>
				</Column>
				
				<Column>
					<Accordion>
						<AccordionItem title='Concepts ({result.concepts.length})' open>
							<UnorderedList>
								{#each result.concepts as concept}
									<ListItem style='display: flex, align-items: center'>
										<Tag type='blue' disabled={!concept.text.includes(value)}>
											{concept.text}</Tag>
									</ListItem>
								{/each}
							</UnorderedList>
						</AccordionItem>
						<AccordionItem title='Entities ({result.entities.length})' open>
							{#each Object.keys(result.entitiesByType) as entityType}
								<div>
									{entityType}:
									{#each result.entitiesByType[entityType] as entity}
										<Tag type='teal' disabled={!entity.text.includes(value)}>
											{entity.text}</Tag>
									{/each}
								</div>
							{/each}
						</AccordionItem>
						<AccordionItem title='Keywords ({result.concepts.length})' open>
							{#each result.keywords as keyword}
								<Tag type='purple' disabled={!keyword.text.includes(value)}>
									{keyword.text}&nbsp;
									<strong>({keyword.sentiment.label})</strong>
								</Tag>
							{/each}
						</AccordionItem>
					</Accordion>
				</Column>
			</Row>
		{/each}
	{/if}
</Grid>

<style>
	:global(.bx--loading) {
		margin: auto;
	}

	:global(.bx--row):not(:last-child) {
		margin-top: 1.5rem;
		margin-bottom: 3.5rem;
	}

	:global(.bx--row):last-child {
		margin-bottom: 1.5rem;
	}

	img {
		width: 100%;
	}
</style>