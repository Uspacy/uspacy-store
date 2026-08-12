export const PermissionsControllerViewEnums = [
	{
		keyCategory: 'CRM',
		key: 'crm',
		subMenuList: [
			{
				id: 1,
				name: 'leads',
				key: 'leads',
			},
			{
				id: 2,
				name: 'contacts',
				key: 'contacts',
			},
			{
				id: 3,
				name: 'companies',
				key: 'companies',
			},
			{
				id: 4,
				name: 'deals',
				key: 'deals',
			},
			{
				id: 5,
				name: 'activity',
				key: 'activity',
			},
		],
	},
	{
		keyCategory: 'hrm',
		key: 'hrm',
		subMenuList: [
			{
				id: 1,
				name: 'employees',
				key: 'employee',
			},
			{
				id: 2,
				name: 'Department',
				key: 'department',
			},
		],
	},
	{
		keyCategory: 'communicationCenter',
		key: 'hub',
		subMenuList: [
			{
				id: 1,
				name: 'journal',
				key: 'uspacy_journal',
			},
			{
				id: 2,
				name: 'call',
				key: 'uspacy_calls',
			},
		],
	},
	{
		keyCategory: 'tasks',
		key: 'tasks',
		subMenuList: [
			{
				id: 1,
				name: 'permissionsCreate',
				key: 'create',
			},
			{
				id: 2,
				name: 'permissionsView',
				key: 'view',
			},
			{
				id: 3,
				name: 'permissionsEdit',
				key: 'edit',
			},
			{
				id: 'setter1',
				defaultId: 5,
				name: 'setter',
				key: 'setter',
				parentEntity: 'edit',
				isFunnel: true,
			},
			{
				id: 'responsible1',
				defaultId: 6,
				name: 'responsible',
				key: 'responsible',
				parentEntity: 'edit',
				isFunnel: true,
			},
			{
				id: 'accomplice1',
				defaultId: 7,
				name: 'accomplice',
				key: 'accomplice',
				parentEntity: 'edit',
				isFunnel: true,
			},
			{
				id: 'auditor1',
				defaultId: 8,
				name: 'auditor',
				key: 'auditor',
				parentEntity: 'edit',
				isFunnel: true,
			},
			{
				id: 4,
				name: 'permissionsDelete',
				key: 'delete',
			},
			{
				id: 'setter2',
				defaultId: 9,
				name: 'setter',
				key: 'setter',
				parentEntity: 'delete',
				isFunnel: true,
			},
			{
				id: 'responsible2',
				defaultId: 10,
				name: 'responsible',
				key: 'responsible',
				parentEntity: 'delete',
				isFunnel: true,
			},
			{
				id: 'accomplice2',
				defaultId: 11,
				name: 'accomplice',
				key: 'accomplice',
				parentEntity: 'delete',
				isFunnel: true,
			},
			{
				id: 'auditor2',
				defaultId: 12,
				name: 'auditor',
				key: 'auditor',
				parentEntity: 'delete',
				isFunnel: true,
			},
		],
	},
];
