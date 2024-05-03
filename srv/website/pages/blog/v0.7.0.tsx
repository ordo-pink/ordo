// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BlogPostLayout } from "../../layouts/blog-layout"
import { Callout } from "components/callout"

export default function Home() {
	return (
		<BlogPostLayout
			post={{
				date: new Date("2024-05-03"),
				description:
					"Редактор Ordo стал удобнее! Наверное. Теперь можно использовать Markdown Shortcuts без изменения раскладки клавиатуры, с помощью / можно вызывать меню быстрого доступа, а также добавлены компоненты редактора - выноска, содержание страницы, а также метки и ссылки на другие документы с автозаполнением!",
				labels: ["релиз", "улучшения", "исправления"],
				slug: "v0.7.0",
				title: "v0.7.0",
			}}
		>
			<div className="flex flex-col space-y-4">
				<Callout type="success">
					Данное обновление не содержит нарушений обратной совместимости.
				</Callout>

				<div>
					Данное обновление направлено на улучшение пользовательского опыта в использовании
					текстового редактора. Также исправлены некоторые ошибки и добавлены новые.
				</div>

				<h2 className="text-xl font-extrabold">Улучшения</h2>

				<ul className="flex list-disc flex-col space-y-4">
					<li>
						Добавлена поддержка указания внутренних ссылок на другие документы внутри редактора с
						механизмом fuzzy search для быстрых подсказок. Для создания ссылки используйте
						восклицательный знак (<code>!</code>). Указанная ссылка будет автоматически применена к
						метаданным файла в свойстве <em>&ldquo;Исходящие ссылки&rdquo;</em>.
					</li>

					<li>
						Добавлена поддержка указания меток внутри редактора с механизмом fuzzy search для
						быстрых подсказок. Для создания метки используйте символ тюряги (<code>#</code>) или
						номер на русскоязычной раскладке (<code>№</code>). Новые метки также возможно создавать
						прямо внутри редактора. Указанная метка будет автоматически применена к метаданным файла
						в свойстве <em>&ldquo;Метки&rdquo;</em>.
					</li>

					<li>
						Для Markdown сокращений добавлена поддержка русскоязычной раскладки. Теперь можно
						создавать заголовки, не переключая раскладку, если вы пишете текст на русском языке.
						Например, <code>### </code> и <code>№№№ </code>, использованные в начале строки,
						создадут <strong>Заголовок 3</strong>.
					</li>

					<li>
						Добавлена панель быстрого доступа редактора. Она позволяет использовать различные
						компоненты и блоки редактора и менять оформление текущей строки. Для вызова панели
						быстрого доступа, нужно, находясь в начале строки, нажать клавишу не то передний, не то
						задний слеш - кто их разберёт (<code>/</code>) или клавишу точки (<code>.</code>) в
						русскоязычной раскладке.
					</li>

					<li>
						Добавлен компонент редактора <strong>Callout (выноска)</strong>, который можно
						использовать для выделения важного блока текста. Выноску можно создать с помощью панели
						быстрого доступа редактора. Для компонента выноски можно указать один из нескольких
						типов, что влияет на его цвет и отображаемую иконку:
						<ol className="my-2 flex list-inside list-decimal flex-col space-y-2">
							<Callout>Default</Callout>
							<Callout type="info">Info</Callout>
							<Callout type="success">Success</Callout>
							<Callout type="warn">Warning</Callout>
							<Callout type="error">Error</Callout>
							<Callout type="question">Question</Callout>
						</ol>
					</li>

					<li>
						Добавлен компонент редактора <strong>Table of Contents (Содержание)</strong>, который
						можно использовать для отображения карты содержимого текущего файла. Компонент можно
						создать с помощью панели быстрого доступа редактора.
					</li>

					<li>
						Во всплывающем меню управления шрифтом (появляется при выделении текста) добавлена
						поддержка применения <code>моноширного шрифта</code>.
					</li>

					<li>
						Теперь редактор автоматически создаёт новый блок типа <strong>параграф</strong> при
						нажатии на клавишу <code>Enter</code>, если предыдущий блок не был элементом списка.
						Если предыдущий блок был элементом списка, редактор создаст новый блок с элементом
						такого же типа (чекбокс, элемент нумерованного списка, либо элемент ненумерованного
						списка). Для того, чтобы принудить редактор создать <strong>параграф</strong>, повторно
						нажмите <code>Enter</code>.
					</li>
				</ul>

				<h2 className="text-xl font-extrabold">Исправления</h2>

				<ul className="flex list-disc flex-col space-y-4">
					<li className="list-disc">
						Исправлена ошибка, в результате которой редактор перезагружался при сохранении
						изменений.
					</li>

					<li className="list-disc">
						Исправлена неполадка, приводившая к некорректному отображению списка файлов в модальном
						окне перемещения файла.
					</li>

					<li className="list-disc">
						Исправлен баг, в результате которого модальные окна управления ссылками и метками
						автоматически закрывались при нажатии на один из элементов с помощью мыши.
					</li>

					<li className="list-disc">
						Модальное окно управления метками теперь остаётся открытым после создания новой метки.
					</li>

					<li className="list-disc">
						Улучшено визуальное отображение чекбокс элемента списка - при наличии нескольких строк
						текста чекбокс теперь крепится к верхнему краю, а не к центру, как было ранее.
					</li>

					<li className="list-disc">
						Внесены улучшения в использование мобильной версии приложения: отключено автоматическое
						фокусирование полей ввода для мобильных устройств, а также исправлена минимальная высота
						окна самого приложения, вступавшая в противоречивую дуэль с пропадающем полем адресной
						строки (совсем с ума сошли выдумывать её скрывать).
					</li>

					<li className="list-disc">
						Исправлена ошибка, в результате которой некоторые пользователи не могли создавать новые
						файлы в Ordo.
					</li>

					<li className="list-disc">
						Исправлено визуальное отображение упорядоченных и неупорядоченных списков в редакторе:
						теперь в зависимости от типа списка корректно отображается либо порядковый номер
						элемента списка, либо кругляш-пухляш.
					</li>
				</ul>
			</div>
		</BlogPostLayout>
	)
}
