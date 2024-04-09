/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IDocumentTemplate } from '@uspacy/sdk/lib/models/crm-document-template';
import { IDocumentTemplateFieldFilters, IDocumentTemplateFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IFile } from '@uspacy/sdk/lib/models/files';

import { API_PREFIX_FILES } from '../../const';
import isEmpty from 'lodash/isEmpty';

export const fetchDocumentTemplates = createAsyncThunk(
	'documentTemplates/fetchDocumentTemplates',
	async (data: { params: IDocumentTemplateFilters; signal: AbortSignal }, thunkAPI) => {
		try {
			const params = {
				page: data.params.page,
				list: data.params.list,
				...(data.params.search ? { search: data.params.search } : {}),
				is_active: (Array.isArray(data.params.is_active) ? data.params.is_active : [data.params.is_active]).map((it) => {
					if (it === 'active') return 1;
					if (it === 'noActive') return 0;
					return it;
				}) as any,
				create_between: data.params.create_between,
				update_between: data.params.update_between,
				...data.params.binding_entities_template?.reduce((acc, curr, idx) => {
					acc[`binding_entities[${idx}][entity_id]`] = curr.entity_id;
					curr.funnels.forEach((funnel, funnelIndex) => {
						acc[`binding_entities[${idx}][funnels][${funnelIndex}]`] = funnel;
					});
					return acc;
				}, {}),
			};

			const res = await uspacySdk?.crmDocumentTemplatesService?.getDocumentTemplates(params, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const fetchDocumentTemplatesFields = createAsyncThunk(
	'documentTemplates/fetchDocumentTemplatesFields',
	async (data: { params: IDocumentTemplateFieldFilters; signal: AbortSignal }, thunkAPI) => {
		try {
			const { search, ...paramsWithoutSearch } = data?.params
			const formattedParams = {
				...paramsWithoutSearch,
				...(!!search ? { search: search } : {}),
			};

			const res = await uspacySdk?.crmDocumentTemplatesService?.getDocumentTemplatesFields(formattedParams, data?.signal);
			return res?.data;
		} catch (e) {
			if (data.signal.aborted) {
				return {
					aborted: true,
				};
			} else {
				return thunkAPI.rejectWithValue('Failure');
			}
		}
	},
);

export const createTemplate = createAsyncThunk('documentTemplates/createTemplate', async (data: { item: Partial<IDocumentTemplate> }, thunkAPI) => {
	try {
		const formData = new FormData();
		formData.append('files[]', data.item.file as File);
		formData.append('entityType', 'document_templates');

		const filesRes = await uspacySdk.httpClient.client.post<{ data: IFile[] }>(`${API_PREFIX_FILES}/files`, formData, {
			headers: {
				'Content-Type': undefined,
			},
		});
		const files = filesRes?.data;

		const resultBody = { ...data.item, file: files?.data[0]?.id };
		const res = await uspacySdk.crmDocumentTemplatesService.createTemplate(resultBody);

		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const updateTemplate = createAsyncThunk('documentTemplates/updateTemplate', async (data: { item: Partial<IDocumentTemplate> }, thunkAPI) => {
	try {
		let files = { data: [{ id: null }] };
		if (!(data.item.file as IFile)?.id) {
			const formData = new FormData();
			formData.append('files[]', data.item.file as File);
			formData.append('entityType', 'document_templates');
			formData.append('entityId', data.item.id.toString());

			const filesRes = await uspacySdk.httpClient.client.post<{ data: IFile[] }>(`${API_PREFIX_FILES}/files`, formData, {
				headers: {
					'Content-Type': undefined,
				},
			});
			files = filesRes?.data;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
		const { file, numerator_id, ...body } = data.item;

		const resultBody = { ...body, ...(files?.data[0]?.id && { file: files?.data[0]?.id }) };

		const res = await uspacySdk.crmDocumentTemplatesService.updateTemplate(data.item.id, resultBody);
		return res?.data;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteTemplate = createAsyncThunk('documentTemplates/deleteTemplate', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.crmDocumentTemplatesService.deleteTemplate(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});

export const deleteArrayTemplates = createAsyncThunk('documentTemplates/deleteArrayTemplates', async (ids: number[], thunkAPI) => {
	try {
		await uspacySdk.crmDocumentTemplatesService.deleteArrayTemplates(ids);

		return ids;
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
