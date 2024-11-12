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

export type TEmojiStatus = "component" | "fully-qualified" | "minimally-qualified" | "unqualified"

export type TEmoji = {
	code_point: string
	status: TEmojiStatus
	icon: string
	version: string
	description: string
}
			
export const emojis: TEmoji[] = [
  {
    "code_point": "1F600",
    "status": "fully-qualified",
    "icon": "😀",
    "version": "E1.0",
    "description": "grinning face"
  },
  {
    "code_point": "1F603",
    "status": "fully-qualified",
    "icon": "😃",
    "version": "E0.6",
    "description": "grinning face with big eyes"
  },
  {
    "code_point": "1F604",
    "status": "fully-qualified",
    "icon": "😄",
    "version": "E0.6",
    "description": "grinning face with smiling eyes"
  },
  {
    "code_point": "1F601",
    "status": "fully-qualified",
    "icon": "😁",
    "version": "E0.6",
    "description": "beaming face with smiling eyes"
  },
  {
    "code_point": "1F606",
    "status": "fully-qualified",
    "icon": "😆",
    "version": "E0.6",
    "description": "grinning squinting face"
  },
  {
    "code_point": "1F605",
    "status": "fully-qualified",
    "icon": "😅",
    "version": "E0.6",
    "description": "grinning face with sweat"
  },
  {
    "code_point": "1F923",
    "status": "fully-qualified",
    "icon": "🤣",
    "version": "E3.0",
    "description": "rolling on the floor laughing"
  },
  {
    "code_point": "1F602",
    "status": "fully-qualified",
    "icon": "😂",
    "version": "E0.6",
    "description": "face with tears of joy"
  },
  {
    "code_point": "1F642",
    "status": "fully-qualified",
    "icon": "🙂",
    "version": "E1.0",
    "description": "slightly smiling face"
  },
  {
    "code_point": "1F643",
    "status": "fully-qualified",
    "icon": "🙃",
    "version": "E1.0",
    "description": "upside-down face"
  },
  {
    "code_point": "1FAE0",
    "status": "fully-qualified",
    "icon": "🫠",
    "version": "E14.0",
    "description": "melting face"
  },
  {
    "code_point": "1F609",
    "status": "fully-qualified",
    "icon": "😉",
    "version": "E0.6",
    "description": "winking face"
  },
  {
    "code_point": "1F60A",
    "status": "fully-qualified",
    "icon": "😊",
    "version": "E0.6",
    "description": "smiling face with smiling eyes"
  },
  {
    "code_point": "1F607",
    "status": "fully-qualified",
    "icon": "😇",
    "version": "E1.0",
    "description": "smiling face with halo"
  },
  {
    "code_point": "1F970",
    "status": "fully-qualified",
    "icon": "🥰",
    "version": "E11.0",
    "description": "smiling face with hearts"
  },
  {
    "code_point": "1F60D",
    "status": "fully-qualified",
    "icon": "😍",
    "version": "E0.6",
    "description": "smiling face with heart-eyes"
  },
  {
    "code_point": "1F929",
    "status": "fully-qualified",
    "icon": "🤩",
    "version": "E5.0",
    "description": "star-struck"
  },
  {
    "code_point": "1F618",
    "status": "fully-qualified",
    "icon": "😘",
    "version": "E0.6",
    "description": "face blowing a kiss"
  },
  {
    "code_point": "1F617",
    "status": "fully-qualified",
    "icon": "😗",
    "version": "E1.0",
    "description": "kissing face"
  },
  {
    "code_point": "263A FE0F",
    "status": "fully-qualified",
    "icon": "☺️",
    "version": "E0.6",
    "description": "smiling face"
  },
  {
    "code_point": "263A",
    "status": "unqualified",
    "icon": "☺",
    "version": "E0.6",
    "description": "smiling face"
  },
  {
    "code_point": "1F61A",
    "status": "fully-qualified",
    "icon": "😚",
    "version": "E0.6",
    "description": "kissing face with closed eyes"
  },
  {
    "code_point": "1F619",
    "status": "fully-qualified",
    "icon": "😙",
    "version": "E1.0",
    "description": "kissing face with smiling eyes"
  },
  {
    "code_point": "1F972",
    "status": "fully-qualified",
    "icon": "🥲",
    "version": "E13.0",
    "description": "smiling face with tear"
  },
  {
    "code_point": "1F60B",
    "status": "fully-qualified",
    "icon": "😋",
    "version": "E0.6",
    "description": "face savoring food"
  },
  {
    "code_point": "1F61B",
    "status": "fully-qualified",
    "icon": "😛",
    "version": "E1.0",
    "description": "face with tongue"
  },
  {
    "code_point": "1F61C",
    "status": "fully-qualified",
    "icon": "😜",
    "version": "E0.6",
    "description": "winking face with tongue"
  },
  {
    "code_point": "1F92A",
    "status": "fully-qualified",
    "icon": "🤪",
    "version": "E5.0",
    "description": "zany face"
  },
  {
    "code_point": "1F61D",
    "status": "fully-qualified",
    "icon": "😝",
    "version": "E0.6",
    "description": "squinting face with tongue"
  },
  {
    "code_point": "1F911",
    "status": "fully-qualified",
    "icon": "🤑",
    "version": "E1.0",
    "description": "money-mouth face"
  },
  {
    "code_point": "1F917",
    "status": "fully-qualified",
    "icon": "🤗",
    "version": "E1.0",
    "description": "smiling face with open hands"
  },
  {
    "code_point": "1F92D",
    "status": "fully-qualified",
    "icon": "🤭",
    "version": "E5.0",
    "description": "face with hand over mouth"
  },
  {
    "code_point": "1FAE2",
    "status": "fully-qualified",
    "icon": "🫢",
    "version": "E14.0",
    "description": "face with open eyes and hand over mouth"
  },
  {
    "code_point": "1FAE3",
    "status": "fully-qualified",
    "icon": "🫣",
    "version": "E14.0",
    "description": "face with peeking eye"
  },
  {
    "code_point": "1F92B",
    "status": "fully-qualified",
    "icon": "🤫",
    "version": "E5.0",
    "description": "shushing face"
  },
  {
    "code_point": "1F914",
    "status": "fully-qualified",
    "icon": "🤔",
    "version": "E1.0",
    "description": "thinking face"
  },
  {
    "code_point": "1FAE1",
    "status": "fully-qualified",
    "icon": "🫡",
    "version": "E14.0",
    "description": "saluting face"
  },
  {
    "code_point": "1F910",
    "status": "fully-qualified",
    "icon": "🤐",
    "version": "E1.0",
    "description": "zipper-mouth face"
  },
  {
    "code_point": "1F928",
    "status": "fully-qualified",
    "icon": "🤨",
    "version": "E5.0",
    "description": "face with raised eyebrow"
  },
  {
    "code_point": "1F610",
    "status": "fully-qualified",
    "icon": "😐",
    "version": "E0.7",
    "description": "neutral face"
  },
  {
    "code_point": "1F611",
    "status": "fully-qualified",
    "icon": "😑",
    "version": "E1.0",
    "description": "expressionless face"
  },
  {
    "code_point": "1F636",
    "status": "fully-qualified",
    "icon": "😶",
    "version": "E1.0",
    "description": "face without mouth"
  },
  {
    "code_point": "1FAE5",
    "status": "fully-qualified",
    "icon": "🫥",
    "version": "E14.0",
    "description": "dotted line face"
  },
  {
    "code_point": "1F636 200D 1F32B FE0F",
    "status": "fully-qualified",
    "icon": "😶‍🌫️",
    "version": "E13.1",
    "description": "face in clouds"
  },
  {
    "code_point": "1F636 200D 1F32B",
    "status": "minimally-qualified",
    "icon": "😶‍🌫",
    "version": "E13.1",
    "description": "face in clouds"
  },
  {
    "code_point": "1F60F",
    "status": "fully-qualified",
    "icon": "😏",
    "version": "E0.6",
    "description": "smirking face"
  },
  {
    "code_point": "1F612",
    "status": "fully-qualified",
    "icon": "😒",
    "version": "E0.6",
    "description": "unamused face"
  },
  {
    "code_point": "1F644",
    "status": "fully-qualified",
    "icon": "🙄",
    "version": "E1.0",
    "description": "face with rolling eyes"
  },
  {
    "code_point": "1F62C",
    "status": "fully-qualified",
    "icon": "😬",
    "version": "E1.0",
    "description": "grimacing face"
  },
  {
    "code_point": "1F62E 200D 1F4A8",
    "status": "fully-qualified",
    "icon": "😮‍💨",
    "version": "E13.1",
    "description": "face exhaling"
  },
  {
    "code_point": "1F925",
    "status": "fully-qualified",
    "icon": "🤥",
    "version": "E3.0",
    "description": "lying face"
  },
  {
    "code_point": "1FAE8",
    "status": "fully-qualified",
    "icon": "🫨",
    "version": "E15.0",
    "description": "shaking face"
  },
  {
    "code_point": "1F642 200D 2194 FE0F",
    "status": "fully-qualified",
    "icon": "🙂‍↔️",
    "version": "E15.1",
    "description": "head shaking horizontally"
  },
  {
    "code_point": "1F642 200D 2194",
    "status": "minimally-qualified",
    "icon": "🙂‍↔",
    "version": "E15.1",
    "description": "head shaking horizontally"
  },
  {
    "code_point": "1F642 200D 2195 FE0F",
    "status": "fully-qualified",
    "icon": "🙂‍↕️",
    "version": "E15.1",
    "description": "head shaking vertically"
  },
  {
    "code_point": "1F642 200D 2195",
    "status": "minimally-qualified",
    "icon": "🙂‍↕",
    "version": "E15.1",
    "description": "head shaking vertically"
  },
  {
    "code_point": "1F60C",
    "status": "fully-qualified",
    "icon": "😌",
    "version": "E0.6",
    "description": "relieved face"
  },
  {
    "code_point": "1F614",
    "status": "fully-qualified",
    "icon": "😔",
    "version": "E0.6",
    "description": "pensive face"
  },
  {
    "code_point": "1F62A",
    "status": "fully-qualified",
    "icon": "😪",
    "version": "E0.6",
    "description": "sleepy face"
  },
  {
    "code_point": "1F924",
    "status": "fully-qualified",
    "icon": "🤤",
    "version": "E3.0",
    "description": "drooling face"
  },
  {
    "code_point": "1F634",
    "status": "fully-qualified",
    "icon": "😴",
    "version": "E1.0",
    "description": "sleeping face"
  },
  {
    "code_point": "1FAE9",
    "status": "fully-qualified",
    "icon": "🫩",
    "version": "E16.0",
    "description": "face with bags under eyes"
  },
  {
    "code_point": "1F637",
    "status": "fully-qualified",
    "icon": "😷",
    "version": "E0.6",
    "description": "face with medical mask"
  },
  {
    "code_point": "1F912",
    "status": "fully-qualified",
    "icon": "🤒",
    "version": "E1.0",
    "description": "face with thermometer"
  },
  {
    "code_point": "1F915",
    "status": "fully-qualified",
    "icon": "🤕",
    "version": "E1.0",
    "description": "face with head-bandage"
  },
  {
    "code_point": "1F922",
    "status": "fully-qualified",
    "icon": "🤢",
    "version": "E3.0",
    "description": "nauseated face"
  },
  {
    "code_point": "1F92E",
    "status": "fully-qualified",
    "icon": "🤮",
    "version": "E5.0",
    "description": "face vomiting"
  },
  {
    "code_point": "1F927",
    "status": "fully-qualified",
    "icon": "🤧",
    "version": "E3.0",
    "description": "sneezing face"
  },
  {
    "code_point": "1F975",
    "status": "fully-qualified",
    "icon": "🥵",
    "version": "E11.0",
    "description": "hot face"
  },
  {
    "code_point": "1F976",
    "status": "fully-qualified",
    "icon": "🥶",
    "version": "E11.0",
    "description": "cold face"
  },
  {
    "code_point": "1F974",
    "status": "fully-qualified",
    "icon": "🥴",
    "version": "E11.0",
    "description": "woozy face"
  },
  {
    "code_point": "1F635",
    "status": "fully-qualified",
    "icon": "😵",
    "version": "E0.6",
    "description": "face with crossed-out eyes"
  },
  {
    "code_point": "1F635 200D 1F4AB",
    "status": "fully-qualified",
    "icon": "😵‍💫",
    "version": "E13.1",
    "description": "face with spiral eyes"
  },
  {
    "code_point": "1F92F",
    "status": "fully-qualified",
    "icon": "🤯",
    "version": "E5.0",
    "description": "exploding head"
  },
  {
    "code_point": "1F920",
    "status": "fully-qualified",
    "icon": "🤠",
    "version": "E3.0",
    "description": "cowboy hat face"
  },
  {
    "code_point": "1F973",
    "status": "fully-qualified",
    "icon": "🥳",
    "version": "E11.0",
    "description": "partying face"
  },
  {
    "code_point": "1F978",
    "status": "fully-qualified",
    "icon": "🥸",
    "version": "E13.0",
    "description": "disguised face"
  },
  {
    "code_point": "1F60E",
    "status": "fully-qualified",
    "icon": "😎",
    "version": "E1.0",
    "description": "smiling face with sunglasses"
  },
  {
    "code_point": "1F913",
    "status": "fully-qualified",
    "icon": "🤓",
    "version": "E1.0",
    "description": "nerd face"
  },
  {
    "code_point": "1F9D0",
    "status": "fully-qualified",
    "icon": "🧐",
    "version": "E5.0",
    "description": "face with monocle"
  },
  {
    "code_point": "1F615",
    "status": "fully-qualified",
    "icon": "😕",
    "version": "E1.0",
    "description": "confused face"
  },
  {
    "code_point": "1FAE4",
    "status": "fully-qualified",
    "icon": "🫤",
    "version": "E14.0",
    "description": "face with diagonal mouth"
  },
  {
    "code_point": "1F61F",
    "status": "fully-qualified",
    "icon": "😟",
    "version": "E1.0",
    "description": "worried face"
  },
  {
    "code_point": "1F641",
    "status": "fully-qualified",
    "icon": "🙁",
    "version": "E1.0",
    "description": "slightly frowning face"
  },
  {
    "code_point": "2639 FE0F",
    "status": "fully-qualified",
    "icon": "☹️",
    "version": "E0.7",
    "description": "frowning face"
  },
  {
    "code_point": "2639",
    "status": "unqualified",
    "icon": "☹",
    "version": "E0.7",
    "description": "frowning face"
  },
  {
    "code_point": "1F62E",
    "status": "fully-qualified",
    "icon": "😮",
    "version": "E1.0",
    "description": "face with open mouth"
  },
  {
    "code_point": "1F62F",
    "status": "fully-qualified",
    "icon": "😯",
    "version": "E1.0",
    "description": "hushed face"
  },
  {
    "code_point": "1F632",
    "status": "fully-qualified",
    "icon": "😲",
    "version": "E0.6",
    "description": "astonished face"
  },
  {
    "code_point": "1F633",
    "status": "fully-qualified",
    "icon": "😳",
    "version": "E0.6",
    "description": "flushed face"
  },
  {
    "code_point": "1F97A",
    "status": "fully-qualified",
    "icon": "🥺",
    "version": "E11.0",
    "description": "pleading face"
  },
  {
    "code_point": "1F979",
    "status": "fully-qualified",
    "icon": "🥹",
    "version": "E14.0",
    "description": "face holding back tears"
  },
  {
    "code_point": "1F626",
    "status": "fully-qualified",
    "icon": "😦",
    "version": "E1.0",
    "description": "frowning face with open mouth"
  },
  {
    "code_point": "1F627",
    "status": "fully-qualified",
    "icon": "😧",
    "version": "E1.0",
    "description": "anguished face"
  },
  {
    "code_point": "1F628",
    "status": "fully-qualified",
    "icon": "😨",
    "version": "E0.6",
    "description": "fearful face"
  },
  {
    "code_point": "1F630",
    "status": "fully-qualified",
    "icon": "😰",
    "version": "E0.6",
    "description": "anxious face with sweat"
  },
  {
    "code_point": "1F625",
    "status": "fully-qualified",
    "icon": "😥",
    "version": "E0.6",
    "description": "sad but relieved face"
  },
  {
    "code_point": "1F622",
    "status": "fully-qualified",
    "icon": "😢",
    "version": "E0.6",
    "description": "crying face"
  },
  {
    "code_point": "1F62D",
    "status": "fully-qualified",
    "icon": "😭",
    "version": "E0.6",
    "description": "loudly crying face"
  },
  {
    "code_point": "1F631",
    "status": "fully-qualified",
    "icon": "😱",
    "version": "E0.6",
    "description": "face screaming in fear"
  },
  {
    "code_point": "1F616",
    "status": "fully-qualified",
    "icon": "😖",
    "version": "E0.6",
    "description": "confounded face"
  },
  {
    "code_point": "1F623",
    "status": "fully-qualified",
    "icon": "😣",
    "version": "E0.6",
    "description": "persevering face"
  },
  {
    "code_point": "1F61E",
    "status": "fully-qualified",
    "icon": "😞",
    "version": "E0.6",
    "description": "disappointed face"
  },
  {
    "code_point": "1F613",
    "status": "fully-qualified",
    "icon": "😓",
    "version": "E0.6",
    "description": "downcast face with sweat"
  },
  {
    "code_point": "1F629",
    "status": "fully-qualified",
    "icon": "😩",
    "version": "E0.6",
    "description": "weary face"
  },
  {
    "code_point": "1F62B",
    "status": "fully-qualified",
    "icon": "😫",
    "version": "E0.6",
    "description": "tired face"
  },
  {
    "code_point": "1F971",
    "status": "fully-qualified",
    "icon": "🥱",
    "version": "E12.0",
    "description": "yawning face"
  },
  {
    "code_point": "1F624",
    "status": "fully-qualified",
    "icon": "😤",
    "version": "E0.6",
    "description": "face with steam from nose"
  },
  {
    "code_point": "1F621",
    "status": "fully-qualified",
    "icon": "😡",
    "version": "E0.6",
    "description": "enraged face"
  },
  {
    "code_point": "1F620",
    "status": "fully-qualified",
    "icon": "😠",
    "version": "E0.6",
    "description": "angry face"
  },
  {
    "code_point": "1F92C",
    "status": "fully-qualified",
    "icon": "🤬",
    "version": "E5.0",
    "description": "face with symbols on mouth"
  },
  {
    "code_point": "1F608",
    "status": "fully-qualified",
    "icon": "😈",
    "version": "E1.0",
    "description": "smiling face with horns"
  },
  {
    "code_point": "1F47F",
    "status": "fully-qualified",
    "icon": "👿",
    "version": "E0.6",
    "description": "angry face with horns"
  },
  {
    "code_point": "1F480",
    "status": "fully-qualified",
    "icon": "💀",
    "version": "E0.6",
    "description": "skull"
  },
  {
    "code_point": "2620 FE0F",
    "status": "fully-qualified",
    "icon": "☠️",
    "version": "E1.0",
    "description": "skull and crossbones"
  },
  {
    "code_point": "2620",
    "status": "unqualified",
    "icon": "☠",
    "version": "E1.0",
    "description": "skull and crossbones"
  },
  {
    "code_point": "1F4A9",
    "status": "fully-qualified",
    "icon": "💩",
    "version": "E0.6",
    "description": "pile of poo"
  },
  {
    "code_point": "1F921",
    "status": "fully-qualified",
    "icon": "🤡",
    "version": "E3.0",
    "description": "clown face"
  },
  {
    "code_point": "1F479",
    "status": "fully-qualified",
    "icon": "👹",
    "version": "E0.6",
    "description": "ogre"
  },
  {
    "code_point": "1F47A",
    "status": "fully-qualified",
    "icon": "👺",
    "version": "E0.6",
    "description": "goblin"
  },
  {
    "code_point": "1F47B",
    "status": "fully-qualified",
    "icon": "👻",
    "version": "E0.6",
    "description": "ghost"
  },
  {
    "code_point": "1F47D",
    "status": "fully-qualified",
    "icon": "👽",
    "version": "E0.6",
    "description": "alien"
  },
  {
    "code_point": "1F47E",
    "status": "fully-qualified",
    "icon": "👾",
    "version": "E0.6",
    "description": "alien monster"
  },
  {
    "code_point": "1F916",
    "status": "fully-qualified",
    "icon": "🤖",
    "version": "E1.0",
    "description": "robot"
  },
  {
    "code_point": "1F63A",
    "status": "fully-qualified",
    "icon": "😺",
    "version": "E0.6",
    "description": "grinning cat"
  },
  {
    "code_point": "1F638",
    "status": "fully-qualified",
    "icon": "😸",
    "version": "E0.6",
    "description": "grinning cat with smiling eyes"
  },
  {
    "code_point": "1F639",
    "status": "fully-qualified",
    "icon": "😹",
    "version": "E0.6",
    "description": "cat with tears of joy"
  },
  {
    "code_point": "1F63B",
    "status": "fully-qualified",
    "icon": "😻",
    "version": "E0.6",
    "description": "smiling cat with heart-eyes"
  },
  {
    "code_point": "1F63C",
    "status": "fully-qualified",
    "icon": "😼",
    "version": "E0.6",
    "description": "cat with wry smile"
  },
  {
    "code_point": "1F63D",
    "status": "fully-qualified",
    "icon": "😽",
    "version": "E0.6",
    "description": "kissing cat"
  },
  {
    "code_point": "1F640",
    "status": "fully-qualified",
    "icon": "🙀",
    "version": "E0.6",
    "description": "weary cat"
  },
  {
    "code_point": "1F63F",
    "status": "fully-qualified",
    "icon": "😿",
    "version": "E0.6",
    "description": "crying cat"
  },
  {
    "code_point": "1F63E",
    "status": "fully-qualified",
    "icon": "😾",
    "version": "E0.6",
    "description": "pouting cat"
  },
  {
    "code_point": "1F648",
    "status": "fully-qualified",
    "icon": "🙈",
    "version": "E0.6",
    "description": "see-no-evil monkey"
  },
  {
    "code_point": "1F649",
    "status": "fully-qualified",
    "icon": "🙉",
    "version": "E0.6",
    "description": "hear-no-evil monkey"
  },
  {
    "code_point": "1F64A",
    "status": "fully-qualified",
    "icon": "🙊",
    "version": "E0.6",
    "description": "speak-no-evil monkey"
  },
  {
    "code_point": "1F48C",
    "status": "fully-qualified",
    "icon": "💌",
    "version": "E0.6",
    "description": "love letter"
  },
  {
    "code_point": "1F498",
    "status": "fully-qualified",
    "icon": "💘",
    "version": "E0.6",
    "description": "heart with arrow"
  },
  {
    "code_point": "1F49D",
    "status": "fully-qualified",
    "icon": "💝",
    "version": "E0.6",
    "description": "heart with ribbon"
  },
  {
    "code_point": "1F496",
    "status": "fully-qualified",
    "icon": "💖",
    "version": "E0.6",
    "description": "sparkling heart"
  },
  {
    "code_point": "1F497",
    "status": "fully-qualified",
    "icon": "💗",
    "version": "E0.6",
    "description": "growing heart"
  },
  {
    "code_point": "1F493",
    "status": "fully-qualified",
    "icon": "💓",
    "version": "E0.6",
    "description": "beating heart"
  },
  {
    "code_point": "1F49E",
    "status": "fully-qualified",
    "icon": "💞",
    "version": "E0.6",
    "description": "revolving hearts"
  },
  {
    "code_point": "1F495",
    "status": "fully-qualified",
    "icon": "💕",
    "version": "E0.6",
    "description": "two hearts"
  },
  {
    "code_point": "1F49F",
    "status": "fully-qualified",
    "icon": "💟",
    "version": "E0.6",
    "description": "heart decoration"
  },
  {
    "code_point": "2763 FE0F",
    "status": "fully-qualified",
    "icon": "❣️",
    "version": "E1.0",
    "description": "heart exclamation"
  },
  {
    "code_point": "2763",
    "status": "unqualified",
    "icon": "❣",
    "version": "E1.0",
    "description": "heart exclamation"
  },
  {
    "code_point": "1F494",
    "status": "fully-qualified",
    "icon": "💔",
    "version": "E0.6",
    "description": "broken heart"
  },
  {
    "code_point": "2764 FE0F 200D 1F525",
    "status": "fully-qualified",
    "icon": "❤️‍🔥",
    "version": "E13.1",
    "description": "heart on fire"
  },
  {
    "code_point": "2764 200D 1F525",
    "status": "unqualified",
    "icon": "❤‍🔥",
    "version": "E13.1",
    "description": "heart on fire"
  },
  {
    "code_point": "2764 FE0F 200D 1FA79",
    "status": "fully-qualified",
    "icon": "❤️‍🩹",
    "version": "E13.1",
    "description": "mending heart"
  },
  {
    "code_point": "2764 200D 1FA79",
    "status": "unqualified",
    "icon": "❤‍🩹",
    "version": "E13.1",
    "description": "mending heart"
  },
  {
    "code_point": "2764 FE0F",
    "status": "fully-qualified",
    "icon": "❤️",
    "version": "E0.6",
    "description": "red heart"
  },
  {
    "code_point": "2764",
    "status": "unqualified",
    "icon": "❤",
    "version": "E0.6",
    "description": "red heart"
  },
  {
    "code_point": "1FA77",
    "status": "fully-qualified",
    "icon": "🩷",
    "version": "E15.0",
    "description": "pink heart"
  },
  {
    "code_point": "1F9E1",
    "status": "fully-qualified",
    "icon": "🧡",
    "version": "E5.0",
    "description": "orange heart"
  },
  {
    "code_point": "1F49B",
    "status": "fully-qualified",
    "icon": "💛",
    "version": "E0.6",
    "description": "yellow heart"
  },
  {
    "code_point": "1F49A",
    "status": "fully-qualified",
    "icon": "💚",
    "version": "E0.6",
    "description": "green heart"
  },
  {
    "code_point": "1F499",
    "status": "fully-qualified",
    "icon": "💙",
    "version": "E0.6",
    "description": "blue heart"
  },
  {
    "code_point": "1FA75",
    "status": "fully-qualified",
    "icon": "🩵",
    "version": "E15.0",
    "description": "light blue heart"
  },
  {
    "code_point": "1F49C",
    "status": "fully-qualified",
    "icon": "💜",
    "version": "E0.6",
    "description": "purple heart"
  },
  {
    "code_point": "1F90E",
    "status": "fully-qualified",
    "icon": "🤎",
    "version": "E12.0",
    "description": "brown heart"
  },
  {
    "code_point": "1F5A4",
    "status": "fully-qualified",
    "icon": "🖤",
    "version": "E3.0",
    "description": "black heart"
  },
  {
    "code_point": "1FA76",
    "status": "fully-qualified",
    "icon": "🩶",
    "version": "E15.0",
    "description": "grey heart"
  },
  {
    "code_point": "1F90D",
    "status": "fully-qualified",
    "icon": "🤍",
    "version": "E12.0",
    "description": "white heart"
  },
  {
    "code_point": "1F48B",
    "status": "fully-qualified",
    "icon": "💋",
    "version": "E0.6",
    "description": "kiss mark"
  },
  {
    "code_point": "1F4AF",
    "status": "fully-qualified",
    "icon": "💯",
    "version": "E0.6",
    "description": "hundred points"
  },
  {
    "code_point": "1F4A2",
    "status": "fully-qualified",
    "icon": "💢",
    "version": "E0.6",
    "description": "anger symbol"
  },
  {
    "code_point": "1F4A5",
    "status": "fully-qualified",
    "icon": "💥",
    "version": "E0.6",
    "description": "collision"
  },
  {
    "code_point": "1F4AB",
    "status": "fully-qualified",
    "icon": "💫",
    "version": "E0.6",
    "description": "dizzy"
  },
  {
    "code_point": "1F4A6",
    "status": "fully-qualified",
    "icon": "💦",
    "version": "E0.6",
    "description": "sweat droplets"
  },
  {
    "code_point": "1F4A8",
    "status": "fully-qualified",
    "icon": "💨",
    "version": "E0.6",
    "description": "dashing away"
  },
  {
    "code_point": "1F573 FE0F",
    "status": "fully-qualified",
    "icon": "🕳️",
    "version": "E0.7",
    "description": "hole"
  },
  {
    "code_point": "1F573",
    "status": "unqualified",
    "icon": "🕳",
    "version": "E0.7",
    "description": "hole"
  },
  {
    "code_point": "1F4AC",
    "status": "fully-qualified",
    "icon": "💬",
    "version": "E0.6",
    "description": "speech balloon"
  },
  {
    "code_point": "1F441 FE0F 200D 1F5E8 FE0F",
    "status": "fully-qualified",
    "icon": "👁️‍🗨️",
    "version": "E2.0",
    "description": "eye in speech bubble"
  },
  {
    "code_point": "1F441 200D 1F5E8 FE0F",
    "status": "unqualified",
    "icon": "👁‍🗨️",
    "version": "E2.0",
    "description": "eye in speech bubble"
  },
  {
    "code_point": "1F441 FE0F 200D 1F5E8",
    "status": "minimally-qualified",
    "icon": "👁️‍🗨",
    "version": "E2.0",
    "description": "eye in speech bubble"
  },
  {
    "code_point": "1F441 200D 1F5E8",
    "status": "unqualified",
    "icon": "👁‍🗨",
    "version": "E2.0",
    "description": "eye in speech bubble"
  },
  {
    "code_point": "1F5E8 FE0F",
    "status": "fully-qualified",
    "icon": "🗨️",
    "version": "E2.0",
    "description": "left speech bubble"
  },
  {
    "code_point": "1F5E8",
    "status": "unqualified",
    "icon": "🗨",
    "version": "E2.0",
    "description": "left speech bubble"
  },
  {
    "code_point": "1F5EF FE0F",
    "status": "fully-qualified",
    "icon": "🗯️",
    "version": "E0.7",
    "description": "right anger bubble"
  },
  {
    "code_point": "1F5EF",
    "status": "unqualified",
    "icon": "🗯",
    "version": "E0.7",
    "description": "right anger bubble"
  },
  {
    "code_point": "1F4AD",
    "status": "fully-qualified",
    "icon": "💭",
    "version": "E1.0",
    "description": "thought balloon"
  },
  {
    "code_point": "1F4A4",
    "status": "fully-qualified",
    "icon": "💤",
    "version": "E0.6",
    "description": "ZZZ"
  },
  {
    "code_point": "1F44B",
    "status": "fully-qualified",
    "icon": "👋",
    "version": "E0.6",
    "description": "waving hand"
  },
  {
    "code_point": "1F44B 1F3FB",
    "status": "fully-qualified",
    "icon": "👋🏻",
    "version": "E1.0",
    "description": "waving hand: light skin tone"
  },
  {
    "code_point": "1F44B 1F3FC",
    "status": "fully-qualified",
    "icon": "👋🏼",
    "version": "E1.0",
    "description": "waving hand: medium-light skin tone"
  },
  {
    "code_point": "1F44B 1F3FD",
    "status": "fully-qualified",
    "icon": "👋🏽",
    "version": "E1.0",
    "description": "waving hand: medium skin tone"
  },
  {
    "code_point": "1F44B 1F3FE",
    "status": "fully-qualified",
    "icon": "👋🏾",
    "version": "E1.0",
    "description": "waving hand: medium-dark skin tone"
  },
  {
    "code_point": "1F44B 1F3FF",
    "status": "fully-qualified",
    "icon": "👋🏿",
    "version": "E1.0",
    "description": "waving hand: dark skin tone"
  },
  {
    "code_point": "1F91A",
    "status": "fully-qualified",
    "icon": "🤚",
    "version": "E3.0",
    "description": "raised back of hand"
  },
  {
    "code_point": "1F91A 1F3FB",
    "status": "fully-qualified",
    "icon": "🤚🏻",
    "version": "E3.0",
    "description": "raised back of hand: light skin tone"
  },
  {
    "code_point": "1F91A 1F3FC",
    "status": "fully-qualified",
    "icon": "🤚🏼",
    "version": "E3.0",
    "description": "raised back of hand: medium-light skin tone"
  },
  {
    "code_point": "1F91A 1F3FD",
    "status": "fully-qualified",
    "icon": "🤚🏽",
    "version": "E3.0",
    "description": "raised back of hand: medium skin tone"
  },
  {
    "code_point": "1F91A 1F3FE",
    "status": "fully-qualified",
    "icon": "🤚🏾",
    "version": "E3.0",
    "description": "raised back of hand: medium-dark skin tone"
  },
  {
    "code_point": "1F91A 1F3FF",
    "status": "fully-qualified",
    "icon": "🤚🏿",
    "version": "E3.0",
    "description": "raised back of hand: dark skin tone"
  },
  {
    "code_point": "1F590 FE0F",
    "status": "fully-qualified",
    "icon": "🖐️",
    "version": "E0.7",
    "description": "hand with fingers splayed"
  },
  {
    "code_point": "1F590",
    "status": "unqualified",
    "icon": "🖐",
    "version": "E0.7",
    "description": "hand with fingers splayed"
  },
  {
    "code_point": "1F590 1F3FB",
    "status": "fully-qualified",
    "icon": "🖐🏻",
    "version": "E1.0",
    "description": "hand with fingers splayed: light skin tone"
  },
  {
    "code_point": "1F590 1F3FC",
    "status": "fully-qualified",
    "icon": "🖐🏼",
    "version": "E1.0",
    "description": "hand with fingers splayed: medium-light skin tone"
  },
  {
    "code_point": "1F590 1F3FD",
    "status": "fully-qualified",
    "icon": "🖐🏽",
    "version": "E1.0",
    "description": "hand with fingers splayed: medium skin tone"
  },
  {
    "code_point": "1F590 1F3FE",
    "status": "fully-qualified",
    "icon": "🖐🏾",
    "version": "E1.0",
    "description": "hand with fingers splayed: medium-dark skin tone"
  },
  {
    "code_point": "1F590 1F3FF",
    "status": "fully-qualified",
    "icon": "🖐🏿",
    "version": "E1.0",
    "description": "hand with fingers splayed: dark skin tone"
  },
  {
    "code_point": "270B",
    "status": "fully-qualified",
    "icon": "✋",
    "version": "E0.6",
    "description": "raised hand"
  },
  {
    "code_point": "270B 1F3FB",
    "status": "fully-qualified",
    "icon": "✋🏻",
    "version": "E1.0",
    "description": "raised hand: light skin tone"
  },
  {
    "code_point": "270B 1F3FC",
    "status": "fully-qualified",
    "icon": "✋🏼",
    "version": "E1.0",
    "description": "raised hand: medium-light skin tone"
  },
  {
    "code_point": "270B 1F3FD",
    "status": "fully-qualified",
    "icon": "✋🏽",
    "version": "E1.0",
    "description": "raised hand: medium skin tone"
  },
  {
    "code_point": "270B 1F3FE",
    "status": "fully-qualified",
    "icon": "✋🏾",
    "version": "E1.0",
    "description": "raised hand: medium-dark skin tone"
  },
  {
    "code_point": "270B 1F3FF",
    "status": "fully-qualified",
    "icon": "✋🏿",
    "version": "E1.0",
    "description": "raised hand: dark skin tone"
  },
  {
    "code_point": "1F596",
    "status": "fully-qualified",
    "icon": "🖖",
    "version": "E1.0",
    "description": "vulcan salute"
  },
  {
    "code_point": "1F596 1F3FB",
    "status": "fully-qualified",
    "icon": "🖖🏻",
    "version": "E1.0",
    "description": "vulcan salute: light skin tone"
  },
  {
    "code_point": "1F596 1F3FC",
    "status": "fully-qualified",
    "icon": "🖖🏼",
    "version": "E1.0",
    "description": "vulcan salute: medium-light skin tone"
  },
  {
    "code_point": "1F596 1F3FD",
    "status": "fully-qualified",
    "icon": "🖖🏽",
    "version": "E1.0",
    "description": "vulcan salute: medium skin tone"
  },
  {
    "code_point": "1F596 1F3FE",
    "status": "fully-qualified",
    "icon": "🖖🏾",
    "version": "E1.0",
    "description": "vulcan salute: medium-dark skin tone"
  },
  {
    "code_point": "1F596 1F3FF",
    "status": "fully-qualified",
    "icon": "🖖🏿",
    "version": "E1.0",
    "description": "vulcan salute: dark skin tone"
  },
  {
    "code_point": "1FAF1",
    "status": "fully-qualified",
    "icon": "🫱",
    "version": "E14.0",
    "description": "rightwards hand"
  },
  {
    "code_point": "1FAF1 1F3FB",
    "status": "fully-qualified",
    "icon": "🫱🏻",
    "version": "E14.0",
    "description": "rightwards hand: light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FC",
    "status": "fully-qualified",
    "icon": "🫱🏼",
    "version": "E14.0",
    "description": "rightwards hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FD",
    "status": "fully-qualified",
    "icon": "🫱🏽",
    "version": "E14.0",
    "description": "rightwards hand: medium skin tone"
  },
  {
    "code_point": "1FAF1 1F3FE",
    "status": "fully-qualified",
    "icon": "🫱🏾",
    "version": "E14.0",
    "description": "rightwards hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FF",
    "status": "fully-qualified",
    "icon": "🫱🏿",
    "version": "E14.0",
    "description": "rightwards hand: dark skin tone"
  },
  {
    "code_point": "1FAF2",
    "status": "fully-qualified",
    "icon": "🫲",
    "version": "E14.0",
    "description": "leftwards hand"
  },
  {
    "code_point": "1FAF2 1F3FB",
    "status": "fully-qualified",
    "icon": "🫲🏻",
    "version": "E14.0",
    "description": "leftwards hand: light skin tone"
  },
  {
    "code_point": "1FAF2 1F3FC",
    "status": "fully-qualified",
    "icon": "🫲🏼",
    "version": "E14.0",
    "description": "leftwards hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF2 1F3FD",
    "status": "fully-qualified",
    "icon": "🫲🏽",
    "version": "E14.0",
    "description": "leftwards hand: medium skin tone"
  },
  {
    "code_point": "1FAF2 1F3FE",
    "status": "fully-qualified",
    "icon": "🫲🏾",
    "version": "E14.0",
    "description": "leftwards hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF2 1F3FF",
    "status": "fully-qualified",
    "icon": "🫲🏿",
    "version": "E14.0",
    "description": "leftwards hand: dark skin tone"
  },
  {
    "code_point": "1FAF3",
    "status": "fully-qualified",
    "icon": "🫳",
    "version": "E14.0",
    "description": "palm down hand"
  },
  {
    "code_point": "1FAF3 1F3FB",
    "status": "fully-qualified",
    "icon": "🫳🏻",
    "version": "E14.0",
    "description": "palm down hand: light skin tone"
  },
  {
    "code_point": "1FAF3 1F3FC",
    "status": "fully-qualified",
    "icon": "🫳🏼",
    "version": "E14.0",
    "description": "palm down hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF3 1F3FD",
    "status": "fully-qualified",
    "icon": "🫳🏽",
    "version": "E14.0",
    "description": "palm down hand: medium skin tone"
  },
  {
    "code_point": "1FAF3 1F3FE",
    "status": "fully-qualified",
    "icon": "🫳🏾",
    "version": "E14.0",
    "description": "palm down hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF3 1F3FF",
    "status": "fully-qualified",
    "icon": "🫳🏿",
    "version": "E14.0",
    "description": "palm down hand: dark skin tone"
  },
  {
    "code_point": "1FAF4",
    "status": "fully-qualified",
    "icon": "🫴",
    "version": "E14.0",
    "description": "palm up hand"
  },
  {
    "code_point": "1FAF4 1F3FB",
    "status": "fully-qualified",
    "icon": "🫴🏻",
    "version": "E14.0",
    "description": "palm up hand: light skin tone"
  },
  {
    "code_point": "1FAF4 1F3FC",
    "status": "fully-qualified",
    "icon": "🫴🏼",
    "version": "E14.0",
    "description": "palm up hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF4 1F3FD",
    "status": "fully-qualified",
    "icon": "🫴🏽",
    "version": "E14.0",
    "description": "palm up hand: medium skin tone"
  },
  {
    "code_point": "1FAF4 1F3FE",
    "status": "fully-qualified",
    "icon": "🫴🏾",
    "version": "E14.0",
    "description": "palm up hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF4 1F3FF",
    "status": "fully-qualified",
    "icon": "🫴🏿",
    "version": "E14.0",
    "description": "palm up hand: dark skin tone"
  },
  {
    "code_point": "1FAF7",
    "status": "fully-qualified",
    "icon": "🫷",
    "version": "E15.0",
    "description": "leftwards pushing hand"
  },
  {
    "code_point": "1FAF7 1F3FB",
    "status": "fully-qualified",
    "icon": "🫷🏻",
    "version": "E15.0",
    "description": "leftwards pushing hand: light skin tone"
  },
  {
    "code_point": "1FAF7 1F3FC",
    "status": "fully-qualified",
    "icon": "🫷🏼",
    "version": "E15.0",
    "description": "leftwards pushing hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF7 1F3FD",
    "status": "fully-qualified",
    "icon": "🫷🏽",
    "version": "E15.0",
    "description": "leftwards pushing hand: medium skin tone"
  },
  {
    "code_point": "1FAF7 1F3FE",
    "status": "fully-qualified",
    "icon": "🫷🏾",
    "version": "E15.0",
    "description": "leftwards pushing hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF7 1F3FF",
    "status": "fully-qualified",
    "icon": "🫷🏿",
    "version": "E15.0",
    "description": "leftwards pushing hand: dark skin tone"
  },
  {
    "code_point": "1FAF8",
    "status": "fully-qualified",
    "icon": "🫸",
    "version": "E15.0",
    "description": "rightwards pushing hand"
  },
  {
    "code_point": "1FAF8 1F3FB",
    "status": "fully-qualified",
    "icon": "🫸🏻",
    "version": "E15.0",
    "description": "rightwards pushing hand: light skin tone"
  },
  {
    "code_point": "1FAF8 1F3FC",
    "status": "fully-qualified",
    "icon": "🫸🏼",
    "version": "E15.0",
    "description": "rightwards pushing hand: medium-light skin tone"
  },
  {
    "code_point": "1FAF8 1F3FD",
    "status": "fully-qualified",
    "icon": "🫸🏽",
    "version": "E15.0",
    "description": "rightwards pushing hand: medium skin tone"
  },
  {
    "code_point": "1FAF8 1F3FE",
    "status": "fully-qualified",
    "icon": "🫸🏾",
    "version": "E15.0",
    "description": "rightwards pushing hand: medium-dark skin tone"
  },
  {
    "code_point": "1FAF8 1F3FF",
    "status": "fully-qualified",
    "icon": "🫸🏿",
    "version": "E15.0",
    "description": "rightwards pushing hand: dark skin tone"
  },
  {
    "code_point": "1F44C",
    "status": "fully-qualified",
    "icon": "👌",
    "version": "E0.6",
    "description": "OK hand"
  },
  {
    "code_point": "1F44C 1F3FB",
    "status": "fully-qualified",
    "icon": "👌🏻",
    "version": "E1.0",
    "description": "OK hand: light skin tone"
  },
  {
    "code_point": "1F44C 1F3FC",
    "status": "fully-qualified",
    "icon": "👌🏼",
    "version": "E1.0",
    "description": "OK hand: medium-light skin tone"
  },
  {
    "code_point": "1F44C 1F3FD",
    "status": "fully-qualified",
    "icon": "👌🏽",
    "version": "E1.0",
    "description": "OK hand: medium skin tone"
  },
  {
    "code_point": "1F44C 1F3FE",
    "status": "fully-qualified",
    "icon": "👌🏾",
    "version": "E1.0",
    "description": "OK hand: medium-dark skin tone"
  },
  {
    "code_point": "1F44C 1F3FF",
    "status": "fully-qualified",
    "icon": "👌🏿",
    "version": "E1.0",
    "description": "OK hand: dark skin tone"
  },
  {
    "code_point": "1F90C",
    "status": "fully-qualified",
    "icon": "🤌",
    "version": "E13.0",
    "description": "pinched fingers"
  },
  {
    "code_point": "1F90C 1F3FB",
    "status": "fully-qualified",
    "icon": "🤌🏻",
    "version": "E13.0",
    "description": "pinched fingers: light skin tone"
  },
  {
    "code_point": "1F90C 1F3FC",
    "status": "fully-qualified",
    "icon": "🤌🏼",
    "version": "E13.0",
    "description": "pinched fingers: medium-light skin tone"
  },
  {
    "code_point": "1F90C 1F3FD",
    "status": "fully-qualified",
    "icon": "🤌🏽",
    "version": "E13.0",
    "description": "pinched fingers: medium skin tone"
  },
  {
    "code_point": "1F90C 1F3FE",
    "status": "fully-qualified",
    "icon": "🤌🏾",
    "version": "E13.0",
    "description": "pinched fingers: medium-dark skin tone"
  },
  {
    "code_point": "1F90C 1F3FF",
    "status": "fully-qualified",
    "icon": "🤌🏿",
    "version": "E13.0",
    "description": "pinched fingers: dark skin tone"
  },
  {
    "code_point": "1F90F",
    "status": "fully-qualified",
    "icon": "🤏",
    "version": "E12.0",
    "description": "pinching hand"
  },
  {
    "code_point": "1F90F 1F3FB",
    "status": "fully-qualified",
    "icon": "🤏🏻",
    "version": "E12.0",
    "description": "pinching hand: light skin tone"
  },
  {
    "code_point": "1F90F 1F3FC",
    "status": "fully-qualified",
    "icon": "🤏🏼",
    "version": "E12.0",
    "description": "pinching hand: medium-light skin tone"
  },
  {
    "code_point": "1F90F 1F3FD",
    "status": "fully-qualified",
    "icon": "🤏🏽",
    "version": "E12.0",
    "description": "pinching hand: medium skin tone"
  },
  {
    "code_point": "1F90F 1F3FE",
    "status": "fully-qualified",
    "icon": "🤏🏾",
    "version": "E12.0",
    "description": "pinching hand: medium-dark skin tone"
  },
  {
    "code_point": "1F90F 1F3FF",
    "status": "fully-qualified",
    "icon": "🤏🏿",
    "version": "E12.0",
    "description": "pinching hand: dark skin tone"
  },
  {
    "code_point": "270C FE0F",
    "status": "fully-qualified",
    "icon": "✌️",
    "version": "E0.6",
    "description": "victory hand"
  },
  {
    "code_point": "270C",
    "status": "unqualified",
    "icon": "✌",
    "version": "E0.6",
    "description": "victory hand"
  },
  {
    "code_point": "270C 1F3FB",
    "status": "fully-qualified",
    "icon": "✌🏻",
    "version": "E1.0",
    "description": "victory hand: light skin tone"
  },
  {
    "code_point": "270C 1F3FC",
    "status": "fully-qualified",
    "icon": "✌🏼",
    "version": "E1.0",
    "description": "victory hand: medium-light skin tone"
  },
  {
    "code_point": "270C 1F3FD",
    "status": "fully-qualified",
    "icon": "✌🏽",
    "version": "E1.0",
    "description": "victory hand: medium skin tone"
  },
  {
    "code_point": "270C 1F3FE",
    "status": "fully-qualified",
    "icon": "✌🏾",
    "version": "E1.0",
    "description": "victory hand: medium-dark skin tone"
  },
  {
    "code_point": "270C 1F3FF",
    "status": "fully-qualified",
    "icon": "✌🏿",
    "version": "E1.0",
    "description": "victory hand: dark skin tone"
  },
  {
    "code_point": "1F91E",
    "status": "fully-qualified",
    "icon": "🤞",
    "version": "E3.0",
    "description": "crossed fingers"
  },
  {
    "code_point": "1F91E 1F3FB",
    "status": "fully-qualified",
    "icon": "🤞🏻",
    "version": "E3.0",
    "description": "crossed fingers: light skin tone"
  },
  {
    "code_point": "1F91E 1F3FC",
    "status": "fully-qualified",
    "icon": "🤞🏼",
    "version": "E3.0",
    "description": "crossed fingers: medium-light skin tone"
  },
  {
    "code_point": "1F91E 1F3FD",
    "status": "fully-qualified",
    "icon": "🤞🏽",
    "version": "E3.0",
    "description": "crossed fingers: medium skin tone"
  },
  {
    "code_point": "1F91E 1F3FE",
    "status": "fully-qualified",
    "icon": "🤞🏾",
    "version": "E3.0",
    "description": "crossed fingers: medium-dark skin tone"
  },
  {
    "code_point": "1F91E 1F3FF",
    "status": "fully-qualified",
    "icon": "🤞🏿",
    "version": "E3.0",
    "description": "crossed fingers: dark skin tone"
  },
  {
    "code_point": "1FAF0",
    "status": "fully-qualified",
    "icon": "🫰",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed"
  },
  {
    "code_point": "1FAF0 1F3FB",
    "status": "fully-qualified",
    "icon": "🫰🏻",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed: light skin tone"
  },
  {
    "code_point": "1FAF0 1F3FC",
    "status": "fully-qualified",
    "icon": "🫰🏼",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed: medium-light skin tone"
  },
  {
    "code_point": "1FAF0 1F3FD",
    "status": "fully-qualified",
    "icon": "🫰🏽",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed: medium skin tone"
  },
  {
    "code_point": "1FAF0 1F3FE",
    "status": "fully-qualified",
    "icon": "🫰🏾",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed: medium-dark skin tone"
  },
  {
    "code_point": "1FAF0 1F3FF",
    "status": "fully-qualified",
    "icon": "🫰🏿",
    "version": "E14.0",
    "description": "hand with index finger and thumb crossed: dark skin tone"
  },
  {
    "code_point": "1F91F",
    "status": "fully-qualified",
    "icon": "🤟",
    "version": "E5.0",
    "description": "love-you gesture"
  },
  {
    "code_point": "1F91F 1F3FB",
    "status": "fully-qualified",
    "icon": "🤟🏻",
    "version": "E5.0",
    "description": "love-you gesture: light skin tone"
  },
  {
    "code_point": "1F91F 1F3FC",
    "status": "fully-qualified",
    "icon": "🤟🏼",
    "version": "E5.0",
    "description": "love-you gesture: medium-light skin tone"
  },
  {
    "code_point": "1F91F 1F3FD",
    "status": "fully-qualified",
    "icon": "🤟🏽",
    "version": "E5.0",
    "description": "love-you gesture: medium skin tone"
  },
  {
    "code_point": "1F91F 1F3FE",
    "status": "fully-qualified",
    "icon": "🤟🏾",
    "version": "E5.0",
    "description": "love-you gesture: medium-dark skin tone"
  },
  {
    "code_point": "1F91F 1F3FF",
    "status": "fully-qualified",
    "icon": "🤟🏿",
    "version": "E5.0",
    "description": "love-you gesture: dark skin tone"
  },
  {
    "code_point": "1F918",
    "status": "fully-qualified",
    "icon": "🤘",
    "version": "E1.0",
    "description": "sign of the horns"
  },
  {
    "code_point": "1F918 1F3FB",
    "status": "fully-qualified",
    "icon": "🤘🏻",
    "version": "E1.0",
    "description": "sign of the horns: light skin tone"
  },
  {
    "code_point": "1F918 1F3FC",
    "status": "fully-qualified",
    "icon": "🤘🏼",
    "version": "E1.0",
    "description": "sign of the horns: medium-light skin tone"
  },
  {
    "code_point": "1F918 1F3FD",
    "status": "fully-qualified",
    "icon": "🤘🏽",
    "version": "E1.0",
    "description": "sign of the horns: medium skin tone"
  },
  {
    "code_point": "1F918 1F3FE",
    "status": "fully-qualified",
    "icon": "🤘🏾",
    "version": "E1.0",
    "description": "sign of the horns: medium-dark skin tone"
  },
  {
    "code_point": "1F918 1F3FF",
    "status": "fully-qualified",
    "icon": "🤘🏿",
    "version": "E1.0",
    "description": "sign of the horns: dark skin tone"
  },
  {
    "code_point": "1F919",
    "status": "fully-qualified",
    "icon": "🤙",
    "version": "E3.0",
    "description": "call me hand"
  },
  {
    "code_point": "1F919 1F3FB",
    "status": "fully-qualified",
    "icon": "🤙🏻",
    "version": "E3.0",
    "description": "call me hand: light skin tone"
  },
  {
    "code_point": "1F919 1F3FC",
    "status": "fully-qualified",
    "icon": "🤙🏼",
    "version": "E3.0",
    "description": "call me hand: medium-light skin tone"
  },
  {
    "code_point": "1F919 1F3FD",
    "status": "fully-qualified",
    "icon": "🤙🏽",
    "version": "E3.0",
    "description": "call me hand: medium skin tone"
  },
  {
    "code_point": "1F919 1F3FE",
    "status": "fully-qualified",
    "icon": "🤙🏾",
    "version": "E3.0",
    "description": "call me hand: medium-dark skin tone"
  },
  {
    "code_point": "1F919 1F3FF",
    "status": "fully-qualified",
    "icon": "🤙🏿",
    "version": "E3.0",
    "description": "call me hand: dark skin tone"
  },
  {
    "code_point": "1F448",
    "status": "fully-qualified",
    "icon": "👈",
    "version": "E0.6",
    "description": "backhand index pointing left"
  },
  {
    "code_point": "1F448 1F3FB",
    "status": "fully-qualified",
    "icon": "👈🏻",
    "version": "E1.0",
    "description": "backhand index pointing left: light skin tone"
  },
  {
    "code_point": "1F448 1F3FC",
    "status": "fully-qualified",
    "icon": "👈🏼",
    "version": "E1.0",
    "description": "backhand index pointing left: medium-light skin tone"
  },
  {
    "code_point": "1F448 1F3FD",
    "status": "fully-qualified",
    "icon": "👈🏽",
    "version": "E1.0",
    "description": "backhand index pointing left: medium skin tone"
  },
  {
    "code_point": "1F448 1F3FE",
    "status": "fully-qualified",
    "icon": "👈🏾",
    "version": "E1.0",
    "description": "backhand index pointing left: medium-dark skin tone"
  },
  {
    "code_point": "1F448 1F3FF",
    "status": "fully-qualified",
    "icon": "👈🏿",
    "version": "E1.0",
    "description": "backhand index pointing left: dark skin tone"
  },
  {
    "code_point": "1F449",
    "status": "fully-qualified",
    "icon": "👉",
    "version": "E0.6",
    "description": "backhand index pointing right"
  },
  {
    "code_point": "1F449 1F3FB",
    "status": "fully-qualified",
    "icon": "👉🏻",
    "version": "E1.0",
    "description": "backhand index pointing right: light skin tone"
  },
  {
    "code_point": "1F449 1F3FC",
    "status": "fully-qualified",
    "icon": "👉🏼",
    "version": "E1.0",
    "description": "backhand index pointing right: medium-light skin tone"
  },
  {
    "code_point": "1F449 1F3FD",
    "status": "fully-qualified",
    "icon": "👉🏽",
    "version": "E1.0",
    "description": "backhand index pointing right: medium skin tone"
  },
  {
    "code_point": "1F449 1F3FE",
    "status": "fully-qualified",
    "icon": "👉🏾",
    "version": "E1.0",
    "description": "backhand index pointing right: medium-dark skin tone"
  },
  {
    "code_point": "1F449 1F3FF",
    "status": "fully-qualified",
    "icon": "👉🏿",
    "version": "E1.0",
    "description": "backhand index pointing right: dark skin tone"
  },
  {
    "code_point": "1F446",
    "status": "fully-qualified",
    "icon": "👆",
    "version": "E0.6",
    "description": "backhand index pointing up"
  },
  {
    "code_point": "1F446 1F3FB",
    "status": "fully-qualified",
    "icon": "👆🏻",
    "version": "E1.0",
    "description": "backhand index pointing up: light skin tone"
  },
  {
    "code_point": "1F446 1F3FC",
    "status": "fully-qualified",
    "icon": "👆🏼",
    "version": "E1.0",
    "description": "backhand index pointing up: medium-light skin tone"
  },
  {
    "code_point": "1F446 1F3FD",
    "status": "fully-qualified",
    "icon": "👆🏽",
    "version": "E1.0",
    "description": "backhand index pointing up: medium skin tone"
  },
  {
    "code_point": "1F446 1F3FE",
    "status": "fully-qualified",
    "icon": "👆🏾",
    "version": "E1.0",
    "description": "backhand index pointing up: medium-dark skin tone"
  },
  {
    "code_point": "1F446 1F3FF",
    "status": "fully-qualified",
    "icon": "👆🏿",
    "version": "E1.0",
    "description": "backhand index pointing up: dark skin tone"
  },
  {
    "code_point": "1F595",
    "status": "fully-qualified",
    "icon": "🖕",
    "version": "E1.0",
    "description": "middle finger"
  },
  {
    "code_point": "1F595 1F3FB",
    "status": "fully-qualified",
    "icon": "🖕🏻",
    "version": "E1.0",
    "description": "middle finger: light skin tone"
  },
  {
    "code_point": "1F595 1F3FC",
    "status": "fully-qualified",
    "icon": "🖕🏼",
    "version": "E1.0",
    "description": "middle finger: medium-light skin tone"
  },
  {
    "code_point": "1F595 1F3FD",
    "status": "fully-qualified",
    "icon": "🖕🏽",
    "version": "E1.0",
    "description": "middle finger: medium skin tone"
  },
  {
    "code_point": "1F595 1F3FE",
    "status": "fully-qualified",
    "icon": "🖕🏾",
    "version": "E1.0",
    "description": "middle finger: medium-dark skin tone"
  },
  {
    "code_point": "1F595 1F3FF",
    "status": "fully-qualified",
    "icon": "🖕🏿",
    "version": "E1.0",
    "description": "middle finger: dark skin tone"
  },
  {
    "code_point": "1F447",
    "status": "fully-qualified",
    "icon": "👇",
    "version": "E0.6",
    "description": "backhand index pointing down"
  },
  {
    "code_point": "1F447 1F3FB",
    "status": "fully-qualified",
    "icon": "👇🏻",
    "version": "E1.0",
    "description": "backhand index pointing down: light skin tone"
  },
  {
    "code_point": "1F447 1F3FC",
    "status": "fully-qualified",
    "icon": "👇🏼",
    "version": "E1.0",
    "description": "backhand index pointing down: medium-light skin tone"
  },
  {
    "code_point": "1F447 1F3FD",
    "status": "fully-qualified",
    "icon": "👇🏽",
    "version": "E1.0",
    "description": "backhand index pointing down: medium skin tone"
  },
  {
    "code_point": "1F447 1F3FE",
    "status": "fully-qualified",
    "icon": "👇🏾",
    "version": "E1.0",
    "description": "backhand index pointing down: medium-dark skin tone"
  },
  {
    "code_point": "1F447 1F3FF",
    "status": "fully-qualified",
    "icon": "👇🏿",
    "version": "E1.0",
    "description": "backhand index pointing down: dark skin tone"
  },
  {
    "code_point": "261D FE0F",
    "status": "fully-qualified",
    "icon": "☝️",
    "version": "E0.6",
    "description": "index pointing up"
  },
  {
    "code_point": "261D",
    "status": "unqualified",
    "icon": "☝",
    "version": "E0.6",
    "description": "index pointing up"
  },
  {
    "code_point": "261D 1F3FB",
    "status": "fully-qualified",
    "icon": "☝🏻",
    "version": "E1.0",
    "description": "index pointing up: light skin tone"
  },
  {
    "code_point": "261D 1F3FC",
    "status": "fully-qualified",
    "icon": "☝🏼",
    "version": "E1.0",
    "description": "index pointing up: medium-light skin tone"
  },
  {
    "code_point": "261D 1F3FD",
    "status": "fully-qualified",
    "icon": "☝🏽",
    "version": "E1.0",
    "description": "index pointing up: medium skin tone"
  },
  {
    "code_point": "261D 1F3FE",
    "status": "fully-qualified",
    "icon": "☝🏾",
    "version": "E1.0",
    "description": "index pointing up: medium-dark skin tone"
  },
  {
    "code_point": "261D 1F3FF",
    "status": "fully-qualified",
    "icon": "☝🏿",
    "version": "E1.0",
    "description": "index pointing up: dark skin tone"
  },
  {
    "code_point": "1FAF5",
    "status": "fully-qualified",
    "icon": "🫵",
    "version": "E14.0",
    "description": "index pointing at the viewer"
  },
  {
    "code_point": "1FAF5 1F3FB",
    "status": "fully-qualified",
    "icon": "🫵🏻",
    "version": "E14.0",
    "description": "index pointing at the viewer: light skin tone"
  },
  {
    "code_point": "1FAF5 1F3FC",
    "status": "fully-qualified",
    "icon": "🫵🏼",
    "version": "E14.0",
    "description": "index pointing at the viewer: medium-light skin tone"
  },
  {
    "code_point": "1FAF5 1F3FD",
    "status": "fully-qualified",
    "icon": "🫵🏽",
    "version": "E14.0",
    "description": "index pointing at the viewer: medium skin tone"
  },
  {
    "code_point": "1FAF5 1F3FE",
    "status": "fully-qualified",
    "icon": "🫵🏾",
    "version": "E14.0",
    "description": "index pointing at the viewer: medium-dark skin tone"
  },
  {
    "code_point": "1FAF5 1F3FF",
    "status": "fully-qualified",
    "icon": "🫵🏿",
    "version": "E14.0",
    "description": "index pointing at the viewer: dark skin tone"
  },
  {
    "code_point": "1F44D",
    "status": "fully-qualified",
    "icon": "👍",
    "version": "E0.6",
    "description": "thumbs up"
  },
  {
    "code_point": "1F44D 1F3FB",
    "status": "fully-qualified",
    "icon": "👍🏻",
    "version": "E1.0",
    "description": "thumbs up: light skin tone"
  },
  {
    "code_point": "1F44D 1F3FC",
    "status": "fully-qualified",
    "icon": "👍🏼",
    "version": "E1.0",
    "description": "thumbs up: medium-light skin tone"
  },
  {
    "code_point": "1F44D 1F3FD",
    "status": "fully-qualified",
    "icon": "👍🏽",
    "version": "E1.0",
    "description": "thumbs up: medium skin tone"
  },
  {
    "code_point": "1F44D 1F3FE",
    "status": "fully-qualified",
    "icon": "👍🏾",
    "version": "E1.0",
    "description": "thumbs up: medium-dark skin tone"
  },
  {
    "code_point": "1F44D 1F3FF",
    "status": "fully-qualified",
    "icon": "👍🏿",
    "version": "E1.0",
    "description": "thumbs up: dark skin tone"
  },
  {
    "code_point": "1F44E",
    "status": "fully-qualified",
    "icon": "👎",
    "version": "E0.6",
    "description": "thumbs down"
  },
  {
    "code_point": "1F44E 1F3FB",
    "status": "fully-qualified",
    "icon": "👎🏻",
    "version": "E1.0",
    "description": "thumbs down: light skin tone"
  },
  {
    "code_point": "1F44E 1F3FC",
    "status": "fully-qualified",
    "icon": "👎🏼",
    "version": "E1.0",
    "description": "thumbs down: medium-light skin tone"
  },
  {
    "code_point": "1F44E 1F3FD",
    "status": "fully-qualified",
    "icon": "👎🏽",
    "version": "E1.0",
    "description": "thumbs down: medium skin tone"
  },
  {
    "code_point": "1F44E 1F3FE",
    "status": "fully-qualified",
    "icon": "👎🏾",
    "version": "E1.0",
    "description": "thumbs down: medium-dark skin tone"
  },
  {
    "code_point": "1F44E 1F3FF",
    "status": "fully-qualified",
    "icon": "👎🏿",
    "version": "E1.0",
    "description": "thumbs down: dark skin tone"
  },
  {
    "code_point": "270A",
    "status": "fully-qualified",
    "icon": "✊",
    "version": "E0.6",
    "description": "raised fist"
  },
  {
    "code_point": "270A 1F3FB",
    "status": "fully-qualified",
    "icon": "✊🏻",
    "version": "E1.0",
    "description": "raised fist: light skin tone"
  },
  {
    "code_point": "270A 1F3FC",
    "status": "fully-qualified",
    "icon": "✊🏼",
    "version": "E1.0",
    "description": "raised fist: medium-light skin tone"
  },
  {
    "code_point": "270A 1F3FD",
    "status": "fully-qualified",
    "icon": "✊🏽",
    "version": "E1.0",
    "description": "raised fist: medium skin tone"
  },
  {
    "code_point": "270A 1F3FE",
    "status": "fully-qualified",
    "icon": "✊🏾",
    "version": "E1.0",
    "description": "raised fist: medium-dark skin tone"
  },
  {
    "code_point": "270A 1F3FF",
    "status": "fully-qualified",
    "icon": "✊🏿",
    "version": "E1.0",
    "description": "raised fist: dark skin tone"
  },
  {
    "code_point": "1F44A",
    "status": "fully-qualified",
    "icon": "👊",
    "version": "E0.6",
    "description": "oncoming fist"
  },
  {
    "code_point": "1F44A 1F3FB",
    "status": "fully-qualified",
    "icon": "👊🏻",
    "version": "E1.0",
    "description": "oncoming fist: light skin tone"
  },
  {
    "code_point": "1F44A 1F3FC",
    "status": "fully-qualified",
    "icon": "👊🏼",
    "version": "E1.0",
    "description": "oncoming fist: medium-light skin tone"
  },
  {
    "code_point": "1F44A 1F3FD",
    "status": "fully-qualified",
    "icon": "👊🏽",
    "version": "E1.0",
    "description": "oncoming fist: medium skin tone"
  },
  {
    "code_point": "1F44A 1F3FE",
    "status": "fully-qualified",
    "icon": "👊🏾",
    "version": "E1.0",
    "description": "oncoming fist: medium-dark skin tone"
  },
  {
    "code_point": "1F44A 1F3FF",
    "status": "fully-qualified",
    "icon": "👊🏿",
    "version": "E1.0",
    "description": "oncoming fist: dark skin tone"
  },
  {
    "code_point": "1F91B",
    "status": "fully-qualified",
    "icon": "🤛",
    "version": "E3.0",
    "description": "left-facing fist"
  },
  {
    "code_point": "1F91B 1F3FB",
    "status": "fully-qualified",
    "icon": "🤛🏻",
    "version": "E3.0",
    "description": "left-facing fist: light skin tone"
  },
  {
    "code_point": "1F91B 1F3FC",
    "status": "fully-qualified",
    "icon": "🤛🏼",
    "version": "E3.0",
    "description": "left-facing fist: medium-light skin tone"
  },
  {
    "code_point": "1F91B 1F3FD",
    "status": "fully-qualified",
    "icon": "🤛🏽",
    "version": "E3.0",
    "description": "left-facing fist: medium skin tone"
  },
  {
    "code_point": "1F91B 1F3FE",
    "status": "fully-qualified",
    "icon": "🤛🏾",
    "version": "E3.0",
    "description": "left-facing fist: medium-dark skin tone"
  },
  {
    "code_point": "1F91B 1F3FF",
    "status": "fully-qualified",
    "icon": "🤛🏿",
    "version": "E3.0",
    "description": "left-facing fist: dark skin tone"
  },
  {
    "code_point": "1F91C",
    "status": "fully-qualified",
    "icon": "🤜",
    "version": "E3.0",
    "description": "right-facing fist"
  },
  {
    "code_point": "1F91C 1F3FB",
    "status": "fully-qualified",
    "icon": "🤜🏻",
    "version": "E3.0",
    "description": "right-facing fist: light skin tone"
  },
  {
    "code_point": "1F91C 1F3FC",
    "status": "fully-qualified",
    "icon": "🤜🏼",
    "version": "E3.0",
    "description": "right-facing fist: medium-light skin tone"
  },
  {
    "code_point": "1F91C 1F3FD",
    "status": "fully-qualified",
    "icon": "🤜🏽",
    "version": "E3.0",
    "description": "right-facing fist: medium skin tone"
  },
  {
    "code_point": "1F91C 1F3FE",
    "status": "fully-qualified",
    "icon": "🤜🏾",
    "version": "E3.0",
    "description": "right-facing fist: medium-dark skin tone"
  },
  {
    "code_point": "1F91C 1F3FF",
    "status": "fully-qualified",
    "icon": "🤜🏿",
    "version": "E3.0",
    "description": "right-facing fist: dark skin tone"
  },
  {
    "code_point": "1F44F",
    "status": "fully-qualified",
    "icon": "👏",
    "version": "E0.6",
    "description": "clapping hands"
  },
  {
    "code_point": "1F44F 1F3FB",
    "status": "fully-qualified",
    "icon": "👏🏻",
    "version": "E1.0",
    "description": "clapping hands: light skin tone"
  },
  {
    "code_point": "1F44F 1F3FC",
    "status": "fully-qualified",
    "icon": "👏🏼",
    "version": "E1.0",
    "description": "clapping hands: medium-light skin tone"
  },
  {
    "code_point": "1F44F 1F3FD",
    "status": "fully-qualified",
    "icon": "👏🏽",
    "version": "E1.0",
    "description": "clapping hands: medium skin tone"
  },
  {
    "code_point": "1F44F 1F3FE",
    "status": "fully-qualified",
    "icon": "👏🏾",
    "version": "E1.0",
    "description": "clapping hands: medium-dark skin tone"
  },
  {
    "code_point": "1F44F 1F3FF",
    "status": "fully-qualified",
    "icon": "👏🏿",
    "version": "E1.0",
    "description": "clapping hands: dark skin tone"
  },
  {
    "code_point": "1F64C",
    "status": "fully-qualified",
    "icon": "🙌",
    "version": "E0.6",
    "description": "raising hands"
  },
  {
    "code_point": "1F64C 1F3FB",
    "status": "fully-qualified",
    "icon": "🙌🏻",
    "version": "E1.0",
    "description": "raising hands: light skin tone"
  },
  {
    "code_point": "1F64C 1F3FC",
    "status": "fully-qualified",
    "icon": "🙌🏼",
    "version": "E1.0",
    "description": "raising hands: medium-light skin tone"
  },
  {
    "code_point": "1F64C 1F3FD",
    "status": "fully-qualified",
    "icon": "🙌🏽",
    "version": "E1.0",
    "description": "raising hands: medium skin tone"
  },
  {
    "code_point": "1F64C 1F3FE",
    "status": "fully-qualified",
    "icon": "🙌🏾",
    "version": "E1.0",
    "description": "raising hands: medium-dark skin tone"
  },
  {
    "code_point": "1F64C 1F3FF",
    "status": "fully-qualified",
    "icon": "🙌🏿",
    "version": "E1.0",
    "description": "raising hands: dark skin tone"
  },
  {
    "code_point": "1FAF6",
    "status": "fully-qualified",
    "icon": "🫶",
    "version": "E14.0",
    "description": "heart hands"
  },
  {
    "code_point": "1FAF6 1F3FB",
    "status": "fully-qualified",
    "icon": "🫶🏻",
    "version": "E14.0",
    "description": "heart hands: light skin tone"
  },
  {
    "code_point": "1FAF6 1F3FC",
    "status": "fully-qualified",
    "icon": "🫶🏼",
    "version": "E14.0",
    "description": "heart hands: medium-light skin tone"
  },
  {
    "code_point": "1FAF6 1F3FD",
    "status": "fully-qualified",
    "icon": "🫶🏽",
    "version": "E14.0",
    "description": "heart hands: medium skin tone"
  },
  {
    "code_point": "1FAF6 1F3FE",
    "status": "fully-qualified",
    "icon": "🫶🏾",
    "version": "E14.0",
    "description": "heart hands: medium-dark skin tone"
  },
  {
    "code_point": "1FAF6 1F3FF",
    "status": "fully-qualified",
    "icon": "🫶🏿",
    "version": "E14.0",
    "description": "heart hands: dark skin tone"
  },
  {
    "code_point": "1F450",
    "status": "fully-qualified",
    "icon": "👐",
    "version": "E0.6",
    "description": "open hands"
  },
  {
    "code_point": "1F450 1F3FB",
    "status": "fully-qualified",
    "icon": "👐🏻",
    "version": "E1.0",
    "description": "open hands: light skin tone"
  },
  {
    "code_point": "1F450 1F3FC",
    "status": "fully-qualified",
    "icon": "👐🏼",
    "version": "E1.0",
    "description": "open hands: medium-light skin tone"
  },
  {
    "code_point": "1F450 1F3FD",
    "status": "fully-qualified",
    "icon": "👐🏽",
    "version": "E1.0",
    "description": "open hands: medium skin tone"
  },
  {
    "code_point": "1F450 1F3FE",
    "status": "fully-qualified",
    "icon": "👐🏾",
    "version": "E1.0",
    "description": "open hands: medium-dark skin tone"
  },
  {
    "code_point": "1F450 1F3FF",
    "status": "fully-qualified",
    "icon": "👐🏿",
    "version": "E1.0",
    "description": "open hands: dark skin tone"
  },
  {
    "code_point": "1F932",
    "status": "fully-qualified",
    "icon": "🤲",
    "version": "E5.0",
    "description": "palms up together"
  },
  {
    "code_point": "1F932 1F3FB",
    "status": "fully-qualified",
    "icon": "🤲🏻",
    "version": "E5.0",
    "description": "palms up together: light skin tone"
  },
  {
    "code_point": "1F932 1F3FC",
    "status": "fully-qualified",
    "icon": "🤲🏼",
    "version": "E5.0",
    "description": "palms up together: medium-light skin tone"
  },
  {
    "code_point": "1F932 1F3FD",
    "status": "fully-qualified",
    "icon": "🤲🏽",
    "version": "E5.0",
    "description": "palms up together: medium skin tone"
  },
  {
    "code_point": "1F932 1F3FE",
    "status": "fully-qualified",
    "icon": "🤲🏾",
    "version": "E5.0",
    "description": "palms up together: medium-dark skin tone"
  },
  {
    "code_point": "1F932 1F3FF",
    "status": "fully-qualified",
    "icon": "🤲🏿",
    "version": "E5.0",
    "description": "palms up together: dark skin tone"
  },
  {
    "code_point": "1F91D",
    "status": "fully-qualified",
    "icon": "🤝",
    "version": "E3.0",
    "description": "handshake"
  },
  {
    "code_point": "1F91D 1F3FB",
    "status": "fully-qualified",
    "icon": "🤝🏻",
    "version": "E14.0",
    "description": "handshake: light skin tone"
  },
  {
    "code_point": "1F91D 1F3FC",
    "status": "fully-qualified",
    "icon": "🤝🏼",
    "version": "E14.0",
    "description": "handshake: medium-light skin tone"
  },
  {
    "code_point": "1F91D 1F3FD",
    "status": "fully-qualified",
    "icon": "🤝🏽",
    "version": "E14.0",
    "description": "handshake: medium skin tone"
  },
  {
    "code_point": "1F91D 1F3FE",
    "status": "fully-qualified",
    "icon": "🤝🏾",
    "version": "E14.0",
    "description": "handshake: medium-dark skin tone"
  },
  {
    "code_point": "1F91D 1F3FF",
    "status": "fully-qualified",
    "icon": "🤝🏿",
    "version": "E14.0",
    "description": "handshake: dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FB 200D 1FAF2 1F3FC",
    "status": "fully-qualified",
    "icon": "🫱🏻‍🫲🏼",
    "version": "E14.0",
    "description": "handshake: light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FB 200D 1FAF2 1F3FD",
    "status": "fully-qualified",
    "icon": "🫱🏻‍🫲🏽",
    "version": "E14.0",
    "description": "handshake: light skin tone, medium skin tone"
  },
  {
    "code_point": "1FAF1 1F3FB 200D 1FAF2 1F3FE",
    "status": "fully-qualified",
    "icon": "🫱🏻‍🫲🏾",
    "version": "E14.0",
    "description": "handshake: light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FB 200D 1FAF2 1F3FF",
    "status": "fully-qualified",
    "icon": "🫱🏻‍🫲🏿",
    "version": "E14.0",
    "description": "handshake: light skin tone, dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FC 200D 1FAF2 1F3FB",
    "status": "fully-qualified",
    "icon": "🫱🏼‍🫲🏻",
    "version": "E14.0",
    "description": "handshake: medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FC 200D 1FAF2 1F3FD",
    "status": "fully-qualified",
    "icon": "🫱🏼‍🫲🏽",
    "version": "E14.0",
    "description": "handshake: medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1FAF1 1F3FC 200D 1FAF2 1F3FE",
    "status": "fully-qualified",
    "icon": "🫱🏼‍🫲🏾",
    "version": "E14.0",
    "description": "handshake: medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FC 200D 1FAF2 1F3FF",
    "status": "fully-qualified",
    "icon": "🫱🏼‍🫲🏿",
    "version": "E14.0",
    "description": "handshake: medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FD 200D 1FAF2 1F3FB",
    "status": "fully-qualified",
    "icon": "🫱🏽‍🫲🏻",
    "version": "E14.0",
    "description": "handshake: medium skin tone, light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FD 200D 1FAF2 1F3FC",
    "status": "fully-qualified",
    "icon": "🫱🏽‍🫲🏼",
    "version": "E14.0",
    "description": "handshake: medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FD 200D 1FAF2 1F3FE",
    "status": "fully-qualified",
    "icon": "🫱🏽‍🫲🏾",
    "version": "E14.0",
    "description": "handshake: medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FD 200D 1FAF2 1F3FF",
    "status": "fully-qualified",
    "icon": "🫱🏽‍🫲🏿",
    "version": "E14.0",
    "description": "handshake: medium skin tone, dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FE 200D 1FAF2 1F3FB",
    "status": "fully-qualified",
    "icon": "🫱🏾‍🫲🏻",
    "version": "E14.0",
    "description": "handshake: medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FE 200D 1FAF2 1F3FC",
    "status": "fully-qualified",
    "icon": "🫱🏾‍🫲🏼",
    "version": "E14.0",
    "description": "handshake: medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FE 200D 1FAF2 1F3FD",
    "status": "fully-qualified",
    "icon": "🫱🏾‍🫲🏽",
    "version": "E14.0",
    "description": "handshake: medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1FAF1 1F3FE 200D 1FAF2 1F3FF",
    "status": "fully-qualified",
    "icon": "🫱🏾‍🫲🏿",
    "version": "E14.0",
    "description": "handshake: medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1FAF1 1F3FF 200D 1FAF2 1F3FB",
    "status": "fully-qualified",
    "icon": "🫱🏿‍🫲🏻",
    "version": "E14.0",
    "description": "handshake: dark skin tone, light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FF 200D 1FAF2 1F3FC",
    "status": "fully-qualified",
    "icon": "🫱🏿‍🫲🏼",
    "version": "E14.0",
    "description": "handshake: dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1FAF1 1F3FF 200D 1FAF2 1F3FD",
    "status": "fully-qualified",
    "icon": "🫱🏿‍🫲🏽",
    "version": "E14.0",
    "description": "handshake: dark skin tone, medium skin tone"
  },
  {
    "code_point": "1FAF1 1F3FF 200D 1FAF2 1F3FE",
    "status": "fully-qualified",
    "icon": "🫱🏿‍🫲🏾",
    "version": "E14.0",
    "description": "handshake: dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F64F",
    "status": "fully-qualified",
    "icon": "🙏",
    "version": "E0.6",
    "description": "folded hands"
  },
  {
    "code_point": "1F64F 1F3FB",
    "status": "fully-qualified",
    "icon": "🙏🏻",
    "version": "E1.0",
    "description": "folded hands: light skin tone"
  },
  {
    "code_point": "1F64F 1F3FC",
    "status": "fully-qualified",
    "icon": "🙏🏼",
    "version": "E1.0",
    "description": "folded hands: medium-light skin tone"
  },
  {
    "code_point": "1F64F 1F3FD",
    "status": "fully-qualified",
    "icon": "🙏🏽",
    "version": "E1.0",
    "description": "folded hands: medium skin tone"
  },
  {
    "code_point": "1F64F 1F3FE",
    "status": "fully-qualified",
    "icon": "🙏🏾",
    "version": "E1.0",
    "description": "folded hands: medium-dark skin tone"
  },
  {
    "code_point": "1F64F 1F3FF",
    "status": "fully-qualified",
    "icon": "🙏🏿",
    "version": "E1.0",
    "description": "folded hands: dark skin tone"
  },
  {
    "code_point": "270D FE0F",
    "status": "fully-qualified",
    "icon": "✍️",
    "version": "E0.7",
    "description": "writing hand"
  },
  {
    "code_point": "270D",
    "status": "unqualified",
    "icon": "✍",
    "version": "E0.7",
    "description": "writing hand"
  },
  {
    "code_point": "270D 1F3FB",
    "status": "fully-qualified",
    "icon": "✍🏻",
    "version": "E1.0",
    "description": "writing hand: light skin tone"
  },
  {
    "code_point": "270D 1F3FC",
    "status": "fully-qualified",
    "icon": "✍🏼",
    "version": "E1.0",
    "description": "writing hand: medium-light skin tone"
  },
  {
    "code_point": "270D 1F3FD",
    "status": "fully-qualified",
    "icon": "✍🏽",
    "version": "E1.0",
    "description": "writing hand: medium skin tone"
  },
  {
    "code_point": "270D 1F3FE",
    "status": "fully-qualified",
    "icon": "✍🏾",
    "version": "E1.0",
    "description": "writing hand: medium-dark skin tone"
  },
  {
    "code_point": "270D 1F3FF",
    "status": "fully-qualified",
    "icon": "✍🏿",
    "version": "E1.0",
    "description": "writing hand: dark skin tone"
  },
  {
    "code_point": "1F485",
    "status": "fully-qualified",
    "icon": "💅",
    "version": "E0.6",
    "description": "nail polish"
  },
  {
    "code_point": "1F485 1F3FB",
    "status": "fully-qualified",
    "icon": "💅🏻",
    "version": "E1.0",
    "description": "nail polish: light skin tone"
  },
  {
    "code_point": "1F485 1F3FC",
    "status": "fully-qualified",
    "icon": "💅🏼",
    "version": "E1.0",
    "description": "nail polish: medium-light skin tone"
  },
  {
    "code_point": "1F485 1F3FD",
    "status": "fully-qualified",
    "icon": "💅🏽",
    "version": "E1.0",
    "description": "nail polish: medium skin tone"
  },
  {
    "code_point": "1F485 1F3FE",
    "status": "fully-qualified",
    "icon": "💅🏾",
    "version": "E1.0",
    "description": "nail polish: medium-dark skin tone"
  },
  {
    "code_point": "1F485 1F3FF",
    "status": "fully-qualified",
    "icon": "💅🏿",
    "version": "E1.0",
    "description": "nail polish: dark skin tone"
  },
  {
    "code_point": "1F933",
    "status": "fully-qualified",
    "icon": "🤳",
    "version": "E3.0",
    "description": "selfie"
  },
  {
    "code_point": "1F933 1F3FB",
    "status": "fully-qualified",
    "icon": "🤳🏻",
    "version": "E3.0",
    "description": "selfie: light skin tone"
  },
  {
    "code_point": "1F933 1F3FC",
    "status": "fully-qualified",
    "icon": "🤳🏼",
    "version": "E3.0",
    "description": "selfie: medium-light skin tone"
  },
  {
    "code_point": "1F933 1F3FD",
    "status": "fully-qualified",
    "icon": "🤳🏽",
    "version": "E3.0",
    "description": "selfie: medium skin tone"
  },
  {
    "code_point": "1F933 1F3FE",
    "status": "fully-qualified",
    "icon": "🤳🏾",
    "version": "E3.0",
    "description": "selfie: medium-dark skin tone"
  },
  {
    "code_point": "1F933 1F3FF",
    "status": "fully-qualified",
    "icon": "🤳🏿",
    "version": "E3.0",
    "description": "selfie: dark skin tone"
  },
  {
    "code_point": "1F4AA",
    "status": "fully-qualified",
    "icon": "💪",
    "version": "E0.6",
    "description": "flexed biceps"
  },
  {
    "code_point": "1F4AA 1F3FB",
    "status": "fully-qualified",
    "icon": "💪🏻",
    "version": "E1.0",
    "description": "flexed biceps: light skin tone"
  },
  {
    "code_point": "1F4AA 1F3FC",
    "status": "fully-qualified",
    "icon": "💪🏼",
    "version": "E1.0",
    "description": "flexed biceps: medium-light skin tone"
  },
  {
    "code_point": "1F4AA 1F3FD",
    "status": "fully-qualified",
    "icon": "💪🏽",
    "version": "E1.0",
    "description": "flexed biceps: medium skin tone"
  },
  {
    "code_point": "1F4AA 1F3FE",
    "status": "fully-qualified",
    "icon": "💪🏾",
    "version": "E1.0",
    "description": "flexed biceps: medium-dark skin tone"
  },
  {
    "code_point": "1F4AA 1F3FF",
    "status": "fully-qualified",
    "icon": "💪🏿",
    "version": "E1.0",
    "description": "flexed biceps: dark skin tone"
  },
  {
    "code_point": "1F9BE",
    "status": "fully-qualified",
    "icon": "🦾",
    "version": "E12.0",
    "description": "mechanical arm"
  },
  {
    "code_point": "1F9BF",
    "status": "fully-qualified",
    "icon": "🦿",
    "version": "E12.0",
    "description": "mechanical leg"
  },
  {
    "code_point": "1F9B5",
    "status": "fully-qualified",
    "icon": "🦵",
    "version": "E11.0",
    "description": "leg"
  },
  {
    "code_point": "1F9B5 1F3FB",
    "status": "fully-qualified",
    "icon": "🦵🏻",
    "version": "E11.0",
    "description": "leg: light skin tone"
  },
  {
    "code_point": "1F9B5 1F3FC",
    "status": "fully-qualified",
    "icon": "🦵🏼",
    "version": "E11.0",
    "description": "leg: medium-light skin tone"
  },
  {
    "code_point": "1F9B5 1F3FD",
    "status": "fully-qualified",
    "icon": "🦵🏽",
    "version": "E11.0",
    "description": "leg: medium skin tone"
  },
  {
    "code_point": "1F9B5 1F3FE",
    "status": "fully-qualified",
    "icon": "🦵🏾",
    "version": "E11.0",
    "description": "leg: medium-dark skin tone"
  },
  {
    "code_point": "1F9B5 1F3FF",
    "status": "fully-qualified",
    "icon": "🦵🏿",
    "version": "E11.0",
    "description": "leg: dark skin tone"
  },
  {
    "code_point": "1F9B6",
    "status": "fully-qualified",
    "icon": "🦶",
    "version": "E11.0",
    "description": "foot"
  },
  {
    "code_point": "1F9B6 1F3FB",
    "status": "fully-qualified",
    "icon": "🦶🏻",
    "version": "E11.0",
    "description": "foot: light skin tone"
  },
  {
    "code_point": "1F9B6 1F3FC",
    "status": "fully-qualified",
    "icon": "🦶🏼",
    "version": "E11.0",
    "description": "foot: medium-light skin tone"
  },
  {
    "code_point": "1F9B6 1F3FD",
    "status": "fully-qualified",
    "icon": "🦶🏽",
    "version": "E11.0",
    "description": "foot: medium skin tone"
  },
  {
    "code_point": "1F9B6 1F3FE",
    "status": "fully-qualified",
    "icon": "🦶🏾",
    "version": "E11.0",
    "description": "foot: medium-dark skin tone"
  },
  {
    "code_point": "1F9B6 1F3FF",
    "status": "fully-qualified",
    "icon": "🦶🏿",
    "version": "E11.0",
    "description": "foot: dark skin tone"
  },
  {
    "code_point": "1F442",
    "status": "fully-qualified",
    "icon": "👂",
    "version": "E0.6",
    "description": "ear"
  },
  {
    "code_point": "1F442 1F3FB",
    "status": "fully-qualified",
    "icon": "👂🏻",
    "version": "E1.0",
    "description": "ear: light skin tone"
  },
  {
    "code_point": "1F442 1F3FC",
    "status": "fully-qualified",
    "icon": "👂🏼",
    "version": "E1.0",
    "description": "ear: medium-light skin tone"
  },
  {
    "code_point": "1F442 1F3FD",
    "status": "fully-qualified",
    "icon": "👂🏽",
    "version": "E1.0",
    "description": "ear: medium skin tone"
  },
  {
    "code_point": "1F442 1F3FE",
    "status": "fully-qualified",
    "icon": "👂🏾",
    "version": "E1.0",
    "description": "ear: medium-dark skin tone"
  },
  {
    "code_point": "1F442 1F3FF",
    "status": "fully-qualified",
    "icon": "👂🏿",
    "version": "E1.0",
    "description": "ear: dark skin tone"
  },
  {
    "code_point": "1F9BB",
    "status": "fully-qualified",
    "icon": "🦻",
    "version": "E12.0",
    "description": "ear with hearing aid"
  },
  {
    "code_point": "1F9BB 1F3FB",
    "status": "fully-qualified",
    "icon": "🦻🏻",
    "version": "E12.0",
    "description": "ear with hearing aid: light skin tone"
  },
  {
    "code_point": "1F9BB 1F3FC",
    "status": "fully-qualified",
    "icon": "🦻🏼",
    "version": "E12.0",
    "description": "ear with hearing aid: medium-light skin tone"
  },
  {
    "code_point": "1F9BB 1F3FD",
    "status": "fully-qualified",
    "icon": "🦻🏽",
    "version": "E12.0",
    "description": "ear with hearing aid: medium skin tone"
  },
  {
    "code_point": "1F9BB 1F3FE",
    "status": "fully-qualified",
    "icon": "🦻🏾",
    "version": "E12.0",
    "description": "ear with hearing aid: medium-dark skin tone"
  },
  {
    "code_point": "1F9BB 1F3FF",
    "status": "fully-qualified",
    "icon": "🦻🏿",
    "version": "E12.0",
    "description": "ear with hearing aid: dark skin tone"
  },
  {
    "code_point": "1F443",
    "status": "fully-qualified",
    "icon": "👃",
    "version": "E0.6",
    "description": "nose"
  },
  {
    "code_point": "1F443 1F3FB",
    "status": "fully-qualified",
    "icon": "👃🏻",
    "version": "E1.0",
    "description": "nose: light skin tone"
  },
  {
    "code_point": "1F443 1F3FC",
    "status": "fully-qualified",
    "icon": "👃🏼",
    "version": "E1.0",
    "description": "nose: medium-light skin tone"
  },
  {
    "code_point": "1F443 1F3FD",
    "status": "fully-qualified",
    "icon": "👃🏽",
    "version": "E1.0",
    "description": "nose: medium skin tone"
  },
  {
    "code_point": "1F443 1F3FE",
    "status": "fully-qualified",
    "icon": "👃🏾",
    "version": "E1.0",
    "description": "nose: medium-dark skin tone"
  },
  {
    "code_point": "1F443 1F3FF",
    "status": "fully-qualified",
    "icon": "👃🏿",
    "version": "E1.0",
    "description": "nose: dark skin tone"
  },
  {
    "code_point": "1F9E0",
    "status": "fully-qualified",
    "icon": "🧠",
    "version": "E5.0",
    "description": "brain"
  },
  {
    "code_point": "1FAC0",
    "status": "fully-qualified",
    "icon": "🫀",
    "version": "E13.0",
    "description": "anatomical heart"
  },
  {
    "code_point": "1FAC1",
    "status": "fully-qualified",
    "icon": "🫁",
    "version": "E13.0",
    "description": "lungs"
  },
  {
    "code_point": "1F9B7",
    "status": "fully-qualified",
    "icon": "🦷",
    "version": "E11.0",
    "description": "tooth"
  },
  {
    "code_point": "1F9B4",
    "status": "fully-qualified",
    "icon": "🦴",
    "version": "E11.0",
    "description": "bone"
  },
  {
    "code_point": "1F440",
    "status": "fully-qualified",
    "icon": "👀",
    "version": "E0.6",
    "description": "eyes"
  },
  {
    "code_point": "1F441 FE0F",
    "status": "fully-qualified",
    "icon": "👁️",
    "version": "E0.7",
    "description": "eye"
  },
  {
    "code_point": "1F441",
    "status": "unqualified",
    "icon": "👁",
    "version": "E0.7",
    "description": "eye"
  },
  {
    "code_point": "1F445",
    "status": "fully-qualified",
    "icon": "👅",
    "version": "E0.6",
    "description": "tongue"
  },
  {
    "code_point": "1F444",
    "status": "fully-qualified",
    "icon": "👄",
    "version": "E0.6",
    "description": "mouth"
  },
  {
    "code_point": "1FAE6",
    "status": "fully-qualified",
    "icon": "🫦",
    "version": "E14.0",
    "description": "biting lip"
  },
  {
    "code_point": "1F476",
    "status": "fully-qualified",
    "icon": "👶",
    "version": "E0.6",
    "description": "baby"
  },
  {
    "code_point": "1F476 1F3FB",
    "status": "fully-qualified",
    "icon": "👶🏻",
    "version": "E1.0",
    "description": "baby: light skin tone"
  },
  {
    "code_point": "1F476 1F3FC",
    "status": "fully-qualified",
    "icon": "👶🏼",
    "version": "E1.0",
    "description": "baby: medium-light skin tone"
  },
  {
    "code_point": "1F476 1F3FD",
    "status": "fully-qualified",
    "icon": "👶🏽",
    "version": "E1.0",
    "description": "baby: medium skin tone"
  },
  {
    "code_point": "1F476 1F3FE",
    "status": "fully-qualified",
    "icon": "👶🏾",
    "version": "E1.0",
    "description": "baby: medium-dark skin tone"
  },
  {
    "code_point": "1F476 1F3FF",
    "status": "fully-qualified",
    "icon": "👶🏿",
    "version": "E1.0",
    "description": "baby: dark skin tone"
  },
  {
    "code_point": "1F9D2",
    "status": "fully-qualified",
    "icon": "🧒",
    "version": "E5.0",
    "description": "child"
  },
  {
    "code_point": "1F9D2 1F3FB",
    "status": "fully-qualified",
    "icon": "🧒🏻",
    "version": "E5.0",
    "description": "child: light skin tone"
  },
  {
    "code_point": "1F9D2 1F3FC",
    "status": "fully-qualified",
    "icon": "🧒🏼",
    "version": "E5.0",
    "description": "child: medium-light skin tone"
  },
  {
    "code_point": "1F9D2 1F3FD",
    "status": "fully-qualified",
    "icon": "🧒🏽",
    "version": "E5.0",
    "description": "child: medium skin tone"
  },
  {
    "code_point": "1F9D2 1F3FE",
    "status": "fully-qualified",
    "icon": "🧒🏾",
    "version": "E5.0",
    "description": "child: medium-dark skin tone"
  },
  {
    "code_point": "1F9D2 1F3FF",
    "status": "fully-qualified",
    "icon": "🧒🏿",
    "version": "E5.0",
    "description": "child: dark skin tone"
  },
  {
    "code_point": "1F466",
    "status": "fully-qualified",
    "icon": "👦",
    "version": "E0.6",
    "description": "boy"
  },
  {
    "code_point": "1F466 1F3FB",
    "status": "fully-qualified",
    "icon": "👦🏻",
    "version": "E1.0",
    "description": "boy: light skin tone"
  },
  {
    "code_point": "1F466 1F3FC",
    "status": "fully-qualified",
    "icon": "👦🏼",
    "version": "E1.0",
    "description": "boy: medium-light skin tone"
  },
  {
    "code_point": "1F466 1F3FD",
    "status": "fully-qualified",
    "icon": "👦🏽",
    "version": "E1.0",
    "description": "boy: medium skin tone"
  },
  {
    "code_point": "1F466 1F3FE",
    "status": "fully-qualified",
    "icon": "👦🏾",
    "version": "E1.0",
    "description": "boy: medium-dark skin tone"
  },
  {
    "code_point": "1F466 1F3FF",
    "status": "fully-qualified",
    "icon": "👦🏿",
    "version": "E1.0",
    "description": "boy: dark skin tone"
  },
  {
    "code_point": "1F467",
    "status": "fully-qualified",
    "icon": "👧",
    "version": "E0.6",
    "description": "girl"
  },
  {
    "code_point": "1F467 1F3FB",
    "status": "fully-qualified",
    "icon": "👧🏻",
    "version": "E1.0",
    "description": "girl: light skin tone"
  },
  {
    "code_point": "1F467 1F3FC",
    "status": "fully-qualified",
    "icon": "👧🏼",
    "version": "E1.0",
    "description": "girl: medium-light skin tone"
  },
  {
    "code_point": "1F467 1F3FD",
    "status": "fully-qualified",
    "icon": "👧🏽",
    "version": "E1.0",
    "description": "girl: medium skin tone"
  },
  {
    "code_point": "1F467 1F3FE",
    "status": "fully-qualified",
    "icon": "👧🏾",
    "version": "E1.0",
    "description": "girl: medium-dark skin tone"
  },
  {
    "code_point": "1F467 1F3FF",
    "status": "fully-qualified",
    "icon": "👧🏿",
    "version": "E1.0",
    "description": "girl: dark skin tone"
  },
  {
    "code_point": "1F9D1",
    "status": "fully-qualified",
    "icon": "🧑",
    "version": "E5.0",
    "description": "person"
  },
  {
    "code_point": "1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏻",
    "version": "E5.0",
    "description": "person: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏼",
    "version": "E5.0",
    "description": "person: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏽",
    "version": "E5.0",
    "description": "person: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏾",
    "version": "E5.0",
    "description": "person: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏿",
    "version": "E5.0",
    "description": "person: dark skin tone"
  },
  {
    "code_point": "1F471",
    "status": "fully-qualified",
    "icon": "👱",
    "version": "E0.6",
    "description": "person: blond hair"
  },
  {
    "code_point": "1F471 1F3FB",
    "status": "fully-qualified",
    "icon": "👱🏻",
    "version": "E1.0",
    "description": "person: light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FC",
    "status": "fully-qualified",
    "icon": "👱🏼",
    "version": "E1.0",
    "description": "person: medium-light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FD",
    "status": "fully-qualified",
    "icon": "👱🏽",
    "version": "E1.0",
    "description": "person: medium skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FE",
    "status": "fully-qualified",
    "icon": "👱🏾",
    "version": "E1.0",
    "description": "person: medium-dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FF",
    "status": "fully-qualified",
    "icon": "👱🏿",
    "version": "E1.0",
    "description": "person: dark skin tone, blond hair"
  },
  {
    "code_point": "1F468",
    "status": "fully-qualified",
    "icon": "👨",
    "version": "E0.6",
    "description": "man"
  },
  {
    "code_point": "1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏻",
    "version": "E1.0",
    "description": "man: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏼",
    "version": "E1.0",
    "description": "man: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏽",
    "version": "E1.0",
    "description": "man: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏾",
    "version": "E1.0",
    "description": "man: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏿",
    "version": "E1.0",
    "description": "man: dark skin tone"
  },
  {
    "code_point": "1F9D4",
    "status": "fully-qualified",
    "icon": "🧔",
    "version": "E5.0",
    "description": "person: beard"
  },
  {
    "code_point": "1F9D4 1F3FB",
    "status": "fully-qualified",
    "icon": "🧔🏻",
    "version": "E5.0",
    "description": "person: light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FC",
    "status": "fully-qualified",
    "icon": "🧔🏼",
    "version": "E5.0",
    "description": "person: medium-light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FD",
    "status": "fully-qualified",
    "icon": "🧔🏽",
    "version": "E5.0",
    "description": "person: medium skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FE",
    "status": "fully-qualified",
    "icon": "🧔🏾",
    "version": "E5.0",
    "description": "person: medium-dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FF",
    "status": "fully-qualified",
    "icon": "🧔🏿",
    "version": "E5.0",
    "description": "person: dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔‍♂️",
    "version": "E13.1",
    "description": "man: beard"
  },
  {
    "code_point": "1F9D4 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔‍♂",
    "version": "E13.1",
    "description": "man: beard"
  },
  {
    "code_point": "1F9D4 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏻‍♂️",
    "version": "E13.1",
    "description": "man: light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔🏻‍♂",
    "version": "E13.1",
    "description": "man: light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏼‍♂️",
    "version": "E13.1",
    "description": "man: medium-light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔🏼‍♂",
    "version": "E13.1",
    "description": "man: medium-light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏽‍♂️",
    "version": "E13.1",
    "description": "man: medium skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔🏽‍♂",
    "version": "E13.1",
    "description": "man: medium skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏾‍♂️",
    "version": "E13.1",
    "description": "man: medium-dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔🏾‍♂",
    "version": "E13.1",
    "description": "man: medium-dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏿‍♂️",
    "version": "E13.1",
    "description": "man: dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧔🏿‍♂",
    "version": "E13.1",
    "description": "man: dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔‍♀️",
    "version": "E13.1",
    "description": "woman: beard"
  },
  {
    "code_point": "1F9D4 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔‍♀",
    "version": "E13.1",
    "description": "woman: beard"
  },
  {
    "code_point": "1F9D4 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏻‍♀️",
    "version": "E13.1",
    "description": "woman: light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔🏻‍♀",
    "version": "E13.1",
    "description": "woman: light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏼‍♀️",
    "version": "E13.1",
    "description": "woman: medium-light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔🏼‍♀",
    "version": "E13.1",
    "description": "woman: medium-light skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏽‍♀️",
    "version": "E13.1",
    "description": "woman: medium skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔🏽‍♀",
    "version": "E13.1",
    "description": "woman: medium skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏾‍♀️",
    "version": "E13.1",
    "description": "woman: medium-dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔🏾‍♀",
    "version": "E13.1",
    "description": "woman: medium-dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧔🏿‍♀️",
    "version": "E13.1",
    "description": "woman: dark skin tone, beard"
  },
  {
    "code_point": "1F9D4 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧔🏿‍♀",
    "version": "E13.1",
    "description": "woman: dark skin tone, beard"
  },
  {
    "code_point": "1F468 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨‍🦰",
    "version": "E11.0",
    "description": "man: red hair"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦰",
    "version": "E11.0",
    "description": "man: light skin tone, red hair"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦰",
    "version": "E11.0",
    "description": "man: medium-light skin tone, red hair"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦰",
    "version": "E11.0",
    "description": "man: medium skin tone, red hair"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦰",
    "version": "E11.0",
    "description": "man: medium-dark skin tone, red hair"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦰",
    "version": "E11.0",
    "description": "man: dark skin tone, red hair"
  },
  {
    "code_point": "1F468 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨‍🦱",
    "version": "E11.0",
    "description": "man: curly hair"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦱",
    "version": "E11.0",
    "description": "man: light skin tone, curly hair"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦱",
    "version": "E11.0",
    "description": "man: medium-light skin tone, curly hair"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦱",
    "version": "E11.0",
    "description": "man: medium skin tone, curly hair"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦱",
    "version": "E11.0",
    "description": "man: medium-dark skin tone, curly hair"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦱",
    "version": "E11.0",
    "description": "man: dark skin tone, curly hair"
  },
  {
    "code_point": "1F468 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨‍🦳",
    "version": "E11.0",
    "description": "man: white hair"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦳",
    "version": "E11.0",
    "description": "man: light skin tone, white hair"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦳",
    "version": "E11.0",
    "description": "man: medium-light skin tone, white hair"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦳",
    "version": "E11.0",
    "description": "man: medium skin tone, white hair"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦳",
    "version": "E11.0",
    "description": "man: medium-dark skin tone, white hair"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦳",
    "version": "E11.0",
    "description": "man: dark skin tone, white hair"
  },
  {
    "code_point": "1F468 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨‍🦲",
    "version": "E11.0",
    "description": "man: bald"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦲",
    "version": "E11.0",
    "description": "man: light skin tone, bald"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦲",
    "version": "E11.0",
    "description": "man: medium-light skin tone, bald"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦲",
    "version": "E11.0",
    "description": "man: medium skin tone, bald"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦲",
    "version": "E11.0",
    "description": "man: medium-dark skin tone, bald"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦲",
    "version": "E11.0",
    "description": "man: dark skin tone, bald"
  },
  {
    "code_point": "1F469",
    "status": "fully-qualified",
    "icon": "👩",
    "version": "E0.6",
    "description": "woman"
  },
  {
    "code_point": "1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏻",
    "version": "E1.0",
    "description": "woman: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏼",
    "version": "E1.0",
    "description": "woman: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏽",
    "version": "E1.0",
    "description": "woman: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏾",
    "version": "E1.0",
    "description": "woman: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏿",
    "version": "E1.0",
    "description": "woman: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩‍🦰",
    "version": "E11.0",
    "description": "woman: red hair"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦰",
    "version": "E11.0",
    "description": "woman: light skin tone, red hair"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦰",
    "version": "E11.0",
    "description": "woman: medium-light skin tone, red hair"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦰",
    "version": "E11.0",
    "description": "woman: medium skin tone, red hair"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦰",
    "version": "E11.0",
    "description": "woman: medium-dark skin tone, red hair"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦰",
    "version": "E11.0",
    "description": "woman: dark skin tone, red hair"
  },
  {
    "code_point": "1F9D1 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑‍🦰",
    "version": "E12.1",
    "description": "person: red hair"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦰",
    "version": "E12.1",
    "description": "person: light skin tone, red hair"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦰",
    "version": "E12.1",
    "description": "person: medium-light skin tone, red hair"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦰",
    "version": "E12.1",
    "description": "person: medium skin tone, red hair"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦰",
    "version": "E12.1",
    "description": "person: medium-dark skin tone, red hair"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9B0",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦰",
    "version": "E12.1",
    "description": "person: dark skin tone, red hair"
  },
  {
    "code_point": "1F469 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩‍🦱",
    "version": "E11.0",
    "description": "woman: curly hair"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦱",
    "version": "E11.0",
    "description": "woman: light skin tone, curly hair"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦱",
    "version": "E11.0",
    "description": "woman: medium-light skin tone, curly hair"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦱",
    "version": "E11.0",
    "description": "woman: medium skin tone, curly hair"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦱",
    "version": "E11.0",
    "description": "woman: medium-dark skin tone, curly hair"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦱",
    "version": "E11.0",
    "description": "woman: dark skin tone, curly hair"
  },
  {
    "code_point": "1F9D1 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑‍🦱",
    "version": "E12.1",
    "description": "person: curly hair"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦱",
    "version": "E12.1",
    "description": "person: light skin tone, curly hair"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦱",
    "version": "E12.1",
    "description": "person: medium-light skin tone, curly hair"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦱",
    "version": "E12.1",
    "description": "person: medium skin tone, curly hair"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦱",
    "version": "E12.1",
    "description": "person: medium-dark skin tone, curly hair"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9B1",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦱",
    "version": "E12.1",
    "description": "person: dark skin tone, curly hair"
  },
  {
    "code_point": "1F469 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩‍🦳",
    "version": "E11.0",
    "description": "woman: white hair"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦳",
    "version": "E11.0",
    "description": "woman: light skin tone, white hair"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦳",
    "version": "E11.0",
    "description": "woman: medium-light skin tone, white hair"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦳",
    "version": "E11.0",
    "description": "woman: medium skin tone, white hair"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦳",
    "version": "E11.0",
    "description": "woman: medium-dark skin tone, white hair"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦳",
    "version": "E11.0",
    "description": "woman: dark skin tone, white hair"
  },
  {
    "code_point": "1F9D1 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑‍🦳",
    "version": "E12.1",
    "description": "person: white hair"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦳",
    "version": "E12.1",
    "description": "person: light skin tone, white hair"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦳",
    "version": "E12.1",
    "description": "person: medium-light skin tone, white hair"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦳",
    "version": "E12.1",
    "description": "person: medium skin tone, white hair"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦳",
    "version": "E12.1",
    "description": "person: medium-dark skin tone, white hair"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9B3",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦳",
    "version": "E12.1",
    "description": "person: dark skin tone, white hair"
  },
  {
    "code_point": "1F469 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩‍🦲",
    "version": "E11.0",
    "description": "woman: bald"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦲",
    "version": "E11.0",
    "description": "woman: light skin tone, bald"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦲",
    "version": "E11.0",
    "description": "woman: medium-light skin tone, bald"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦲",
    "version": "E11.0",
    "description": "woman: medium skin tone, bald"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦲",
    "version": "E11.0",
    "description": "woman: medium-dark skin tone, bald"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦲",
    "version": "E11.0",
    "description": "woman: dark skin tone, bald"
  },
  {
    "code_point": "1F9D1 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑‍🦲",
    "version": "E12.1",
    "description": "person: bald"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦲",
    "version": "E12.1",
    "description": "person: light skin tone, bald"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦲",
    "version": "E12.1",
    "description": "person: medium-light skin tone, bald"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦲",
    "version": "E12.1",
    "description": "person: medium skin tone, bald"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦲",
    "version": "E12.1",
    "description": "person: medium-dark skin tone, bald"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9B2",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦲",
    "version": "E12.1",
    "description": "person: dark skin tone, bald"
  },
  {
    "code_point": "1F471 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱‍♀️",
    "version": "E4.0",
    "description": "woman: blond hair"
  },
  {
    "code_point": "1F471 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱‍♀",
    "version": "E4.0",
    "description": "woman: blond hair"
  },
  {
    "code_point": "1F471 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏻‍♀️",
    "version": "E4.0",
    "description": "woman: light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱🏻‍♀",
    "version": "E4.0",
    "description": "woman: light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏼‍♀️",
    "version": "E4.0",
    "description": "woman: medium-light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱🏼‍♀",
    "version": "E4.0",
    "description": "woman: medium-light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏽‍♀️",
    "version": "E4.0",
    "description": "woman: medium skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱🏽‍♀",
    "version": "E4.0",
    "description": "woman: medium skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏾‍♀️",
    "version": "E4.0",
    "description": "woman: medium-dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱🏾‍♀",
    "version": "E4.0",
    "description": "woman: medium-dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏿‍♀️",
    "version": "E4.0",
    "description": "woman: dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "👱🏿‍♀",
    "version": "E4.0",
    "description": "woman: dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱‍♂️",
    "version": "E4.0",
    "description": "man: blond hair"
  },
  {
    "code_point": "1F471 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱‍♂",
    "version": "E4.0",
    "description": "man: blond hair"
  },
  {
    "code_point": "1F471 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏻‍♂️",
    "version": "E4.0",
    "description": "man: light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱🏻‍♂",
    "version": "E4.0",
    "description": "man: light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏼‍♂️",
    "version": "E4.0",
    "description": "man: medium-light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱🏼‍♂",
    "version": "E4.0",
    "description": "man: medium-light skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏽‍♂️",
    "version": "E4.0",
    "description": "man: medium skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱🏽‍♂",
    "version": "E4.0",
    "description": "man: medium skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏾‍♂️",
    "version": "E4.0",
    "description": "man: medium-dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱🏾‍♂",
    "version": "E4.0",
    "description": "man: medium-dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👱🏿‍♂️",
    "version": "E4.0",
    "description": "man: dark skin tone, blond hair"
  },
  {
    "code_point": "1F471 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "👱🏿‍♂",
    "version": "E4.0",
    "description": "man: dark skin tone, blond hair"
  },
  {
    "code_point": "1F9D3",
    "status": "fully-qualified",
    "icon": "🧓",
    "version": "E5.0",
    "description": "older person"
  },
  {
    "code_point": "1F9D3 1F3FB",
    "status": "fully-qualified",
    "icon": "🧓🏻",
    "version": "E5.0",
    "description": "older person: light skin tone"
  },
  {
    "code_point": "1F9D3 1F3FC",
    "status": "fully-qualified",
    "icon": "🧓🏼",
    "version": "E5.0",
    "description": "older person: medium-light skin tone"
  },
  {
    "code_point": "1F9D3 1F3FD",
    "status": "fully-qualified",
    "icon": "🧓🏽",
    "version": "E5.0",
    "description": "older person: medium skin tone"
  },
  {
    "code_point": "1F9D3 1F3FE",
    "status": "fully-qualified",
    "icon": "🧓🏾",
    "version": "E5.0",
    "description": "older person: medium-dark skin tone"
  },
  {
    "code_point": "1F9D3 1F3FF",
    "status": "fully-qualified",
    "icon": "🧓🏿",
    "version": "E5.0",
    "description": "older person: dark skin tone"
  },
  {
    "code_point": "1F474",
    "status": "fully-qualified",
    "icon": "👴",
    "version": "E0.6",
    "description": "old man"
  },
  {
    "code_point": "1F474 1F3FB",
    "status": "fully-qualified",
    "icon": "👴🏻",
    "version": "E1.0",
    "description": "old man: light skin tone"
  },
  {
    "code_point": "1F474 1F3FC",
    "status": "fully-qualified",
    "icon": "👴🏼",
    "version": "E1.0",
    "description": "old man: medium-light skin tone"
  },
  {
    "code_point": "1F474 1F3FD",
    "status": "fully-qualified",
    "icon": "👴🏽",
    "version": "E1.0",
    "description": "old man: medium skin tone"
  },
  {
    "code_point": "1F474 1F3FE",
    "status": "fully-qualified",
    "icon": "👴🏾",
    "version": "E1.0",
    "description": "old man: medium-dark skin tone"
  },
  {
    "code_point": "1F474 1F3FF",
    "status": "fully-qualified",
    "icon": "👴🏿",
    "version": "E1.0",
    "description": "old man: dark skin tone"
  },
  {
    "code_point": "1F475",
    "status": "fully-qualified",
    "icon": "👵",
    "version": "E0.6",
    "description": "old woman"
  },
  {
    "code_point": "1F475 1F3FB",
    "status": "fully-qualified",
    "icon": "👵🏻",
    "version": "E1.0",
    "description": "old woman: light skin tone"
  },
  {
    "code_point": "1F475 1F3FC",
    "status": "fully-qualified",
    "icon": "👵🏼",
    "version": "E1.0",
    "description": "old woman: medium-light skin tone"
  },
  {
    "code_point": "1F475 1F3FD",
    "status": "fully-qualified",
    "icon": "👵🏽",
    "version": "E1.0",
    "description": "old woman: medium skin tone"
  },
  {
    "code_point": "1F475 1F3FE",
    "status": "fully-qualified",
    "icon": "👵🏾",
    "version": "E1.0",
    "description": "old woman: medium-dark skin tone"
  },
  {
    "code_point": "1F475 1F3FF",
    "status": "fully-qualified",
    "icon": "👵🏿",
    "version": "E1.0",
    "description": "old woman: dark skin tone"
  },
  {
    "code_point": "1F64D",
    "status": "fully-qualified",
    "icon": "🙍",
    "version": "E0.6",
    "description": "person frowning"
  },
  {
    "code_point": "1F64D 1F3FB",
    "status": "fully-qualified",
    "icon": "🙍🏻",
    "version": "E1.0",
    "description": "person frowning: light skin tone"
  },
  {
    "code_point": "1F64D 1F3FC",
    "status": "fully-qualified",
    "icon": "🙍🏼",
    "version": "E1.0",
    "description": "person frowning: medium-light skin tone"
  },
  {
    "code_point": "1F64D 1F3FD",
    "status": "fully-qualified",
    "icon": "🙍🏽",
    "version": "E1.0",
    "description": "person frowning: medium skin tone"
  },
  {
    "code_point": "1F64D 1F3FE",
    "status": "fully-qualified",
    "icon": "🙍🏾",
    "version": "E1.0",
    "description": "person frowning: medium-dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FF",
    "status": "fully-qualified",
    "icon": "🙍🏿",
    "version": "E1.0",
    "description": "person frowning: dark skin tone"
  },
  {
    "code_point": "1F64D 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍‍♂️",
    "version": "E4.0",
    "description": "man frowning"
  },
  {
    "code_point": "1F64D 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍‍♂",
    "version": "E4.0",
    "description": "man frowning"
  },
  {
    "code_point": "1F64D 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏻‍♂️",
    "version": "E4.0",
    "description": "man frowning: light skin tone"
  },
  {
    "code_point": "1F64D 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍🏻‍♂",
    "version": "E4.0",
    "description": "man frowning: light skin tone"
  },
  {
    "code_point": "1F64D 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏼‍♂️",
    "version": "E4.0",
    "description": "man frowning: medium-light skin tone"
  },
  {
    "code_point": "1F64D 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍🏼‍♂",
    "version": "E4.0",
    "description": "man frowning: medium-light skin tone"
  },
  {
    "code_point": "1F64D 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏽‍♂️",
    "version": "E4.0",
    "description": "man frowning: medium skin tone"
  },
  {
    "code_point": "1F64D 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍🏽‍♂",
    "version": "E4.0",
    "description": "man frowning: medium skin tone"
  },
  {
    "code_point": "1F64D 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏾‍♂️",
    "version": "E4.0",
    "description": "man frowning: medium-dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍🏾‍♂",
    "version": "E4.0",
    "description": "man frowning: medium-dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏿‍♂️",
    "version": "E4.0",
    "description": "man frowning: dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙍🏿‍♂",
    "version": "E4.0",
    "description": "man frowning: dark skin tone"
  },
  {
    "code_point": "1F64D 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍‍♀️",
    "version": "E4.0",
    "description": "woman frowning"
  },
  {
    "code_point": "1F64D 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍‍♀",
    "version": "E4.0",
    "description": "woman frowning"
  },
  {
    "code_point": "1F64D 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏻‍♀️",
    "version": "E4.0",
    "description": "woman frowning: light skin tone"
  },
  {
    "code_point": "1F64D 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍🏻‍♀",
    "version": "E4.0",
    "description": "woman frowning: light skin tone"
  },
  {
    "code_point": "1F64D 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏼‍♀️",
    "version": "E4.0",
    "description": "woman frowning: medium-light skin tone"
  },
  {
    "code_point": "1F64D 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍🏼‍♀",
    "version": "E4.0",
    "description": "woman frowning: medium-light skin tone"
  },
  {
    "code_point": "1F64D 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏽‍♀️",
    "version": "E4.0",
    "description": "woman frowning: medium skin tone"
  },
  {
    "code_point": "1F64D 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍🏽‍♀",
    "version": "E4.0",
    "description": "woman frowning: medium skin tone"
  },
  {
    "code_point": "1F64D 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏾‍♀️",
    "version": "E4.0",
    "description": "woman frowning: medium-dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍🏾‍♀",
    "version": "E4.0",
    "description": "woman frowning: medium-dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙍🏿‍♀️",
    "version": "E4.0",
    "description": "woman frowning: dark skin tone"
  },
  {
    "code_point": "1F64D 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙍🏿‍♀",
    "version": "E4.0",
    "description": "woman frowning: dark skin tone"
  },
  {
    "code_point": "1F64E",
    "status": "fully-qualified",
    "icon": "🙎",
    "version": "E0.6",
    "description": "person pouting"
  },
  {
    "code_point": "1F64E 1F3FB",
    "status": "fully-qualified",
    "icon": "🙎🏻",
    "version": "E1.0",
    "description": "person pouting: light skin tone"
  },
  {
    "code_point": "1F64E 1F3FC",
    "status": "fully-qualified",
    "icon": "🙎🏼",
    "version": "E1.0",
    "description": "person pouting: medium-light skin tone"
  },
  {
    "code_point": "1F64E 1F3FD",
    "status": "fully-qualified",
    "icon": "🙎🏽",
    "version": "E1.0",
    "description": "person pouting: medium skin tone"
  },
  {
    "code_point": "1F64E 1F3FE",
    "status": "fully-qualified",
    "icon": "🙎🏾",
    "version": "E1.0",
    "description": "person pouting: medium-dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FF",
    "status": "fully-qualified",
    "icon": "🙎🏿",
    "version": "E1.0",
    "description": "person pouting: dark skin tone"
  },
  {
    "code_point": "1F64E 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎‍♂️",
    "version": "E4.0",
    "description": "man pouting"
  },
  {
    "code_point": "1F64E 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎‍♂",
    "version": "E4.0",
    "description": "man pouting"
  },
  {
    "code_point": "1F64E 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏻‍♂️",
    "version": "E4.0",
    "description": "man pouting: light skin tone"
  },
  {
    "code_point": "1F64E 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎🏻‍♂",
    "version": "E4.0",
    "description": "man pouting: light skin tone"
  },
  {
    "code_point": "1F64E 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏼‍♂️",
    "version": "E4.0",
    "description": "man pouting: medium-light skin tone"
  },
  {
    "code_point": "1F64E 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎🏼‍♂",
    "version": "E4.0",
    "description": "man pouting: medium-light skin tone"
  },
  {
    "code_point": "1F64E 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏽‍♂️",
    "version": "E4.0",
    "description": "man pouting: medium skin tone"
  },
  {
    "code_point": "1F64E 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎🏽‍♂",
    "version": "E4.0",
    "description": "man pouting: medium skin tone"
  },
  {
    "code_point": "1F64E 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏾‍♂️",
    "version": "E4.0",
    "description": "man pouting: medium-dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎🏾‍♂",
    "version": "E4.0",
    "description": "man pouting: medium-dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏿‍♂️",
    "version": "E4.0",
    "description": "man pouting: dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙎🏿‍♂",
    "version": "E4.0",
    "description": "man pouting: dark skin tone"
  },
  {
    "code_point": "1F64E 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎‍♀️",
    "version": "E4.0",
    "description": "woman pouting"
  },
  {
    "code_point": "1F64E 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎‍♀",
    "version": "E4.0",
    "description": "woman pouting"
  },
  {
    "code_point": "1F64E 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏻‍♀️",
    "version": "E4.0",
    "description": "woman pouting: light skin tone"
  },
  {
    "code_point": "1F64E 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎🏻‍♀",
    "version": "E4.0",
    "description": "woman pouting: light skin tone"
  },
  {
    "code_point": "1F64E 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏼‍♀️",
    "version": "E4.0",
    "description": "woman pouting: medium-light skin tone"
  },
  {
    "code_point": "1F64E 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎🏼‍♀",
    "version": "E4.0",
    "description": "woman pouting: medium-light skin tone"
  },
  {
    "code_point": "1F64E 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏽‍♀️",
    "version": "E4.0",
    "description": "woman pouting: medium skin tone"
  },
  {
    "code_point": "1F64E 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎🏽‍♀",
    "version": "E4.0",
    "description": "woman pouting: medium skin tone"
  },
  {
    "code_point": "1F64E 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏾‍♀️",
    "version": "E4.0",
    "description": "woman pouting: medium-dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎🏾‍♀",
    "version": "E4.0",
    "description": "woman pouting: medium-dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙎🏿‍♀️",
    "version": "E4.0",
    "description": "woman pouting: dark skin tone"
  },
  {
    "code_point": "1F64E 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙎🏿‍♀",
    "version": "E4.0",
    "description": "woman pouting: dark skin tone"
  },
  {
    "code_point": "1F645",
    "status": "fully-qualified",
    "icon": "🙅",
    "version": "E0.6",
    "description": "person gesturing NO"
  },
  {
    "code_point": "1F645 1F3FB",
    "status": "fully-qualified",
    "icon": "🙅🏻",
    "version": "E1.0",
    "description": "person gesturing NO: light skin tone"
  },
  {
    "code_point": "1F645 1F3FC",
    "status": "fully-qualified",
    "icon": "🙅🏼",
    "version": "E1.0",
    "description": "person gesturing NO: medium-light skin tone"
  },
  {
    "code_point": "1F645 1F3FD",
    "status": "fully-qualified",
    "icon": "🙅🏽",
    "version": "E1.0",
    "description": "person gesturing NO: medium skin tone"
  },
  {
    "code_point": "1F645 1F3FE",
    "status": "fully-qualified",
    "icon": "🙅🏾",
    "version": "E1.0",
    "description": "person gesturing NO: medium-dark skin tone"
  },
  {
    "code_point": "1F645 1F3FF",
    "status": "fully-qualified",
    "icon": "🙅🏿",
    "version": "E1.0",
    "description": "person gesturing NO: dark skin tone"
  },
  {
    "code_point": "1F645 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO"
  },
  {
    "code_point": "1F645 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅‍♂",
    "version": "E4.0",
    "description": "man gesturing NO"
  },
  {
    "code_point": "1F645 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏻‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO: light skin tone"
  },
  {
    "code_point": "1F645 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅🏻‍♂",
    "version": "E4.0",
    "description": "man gesturing NO: light skin tone"
  },
  {
    "code_point": "1F645 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏼‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO: medium-light skin tone"
  },
  {
    "code_point": "1F645 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅🏼‍♂",
    "version": "E4.0",
    "description": "man gesturing NO: medium-light skin tone"
  },
  {
    "code_point": "1F645 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏽‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO: medium skin tone"
  },
  {
    "code_point": "1F645 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅🏽‍♂",
    "version": "E4.0",
    "description": "man gesturing NO: medium skin tone"
  },
  {
    "code_point": "1F645 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏾‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO: medium-dark skin tone"
  },
  {
    "code_point": "1F645 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅🏾‍♂",
    "version": "E4.0",
    "description": "man gesturing NO: medium-dark skin tone"
  },
  {
    "code_point": "1F645 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏿‍♂️",
    "version": "E4.0",
    "description": "man gesturing NO: dark skin tone"
  },
  {
    "code_point": "1F645 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙅🏿‍♂",
    "version": "E4.0",
    "description": "man gesturing NO: dark skin tone"
  },
  {
    "code_point": "1F645 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO"
  },
  {
    "code_point": "1F645 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO"
  },
  {
    "code_point": "1F645 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏻‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO: light skin tone"
  },
  {
    "code_point": "1F645 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅🏻‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO: light skin tone"
  },
  {
    "code_point": "1F645 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏼‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO: medium-light skin tone"
  },
  {
    "code_point": "1F645 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅🏼‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO: medium-light skin tone"
  },
  {
    "code_point": "1F645 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏽‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO: medium skin tone"
  },
  {
    "code_point": "1F645 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅🏽‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO: medium skin tone"
  },
  {
    "code_point": "1F645 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏾‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO: medium-dark skin tone"
  },
  {
    "code_point": "1F645 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅🏾‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO: medium-dark skin tone"
  },
  {
    "code_point": "1F645 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙅🏿‍♀️",
    "version": "E4.0",
    "description": "woman gesturing NO: dark skin tone"
  },
  {
    "code_point": "1F645 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙅🏿‍♀",
    "version": "E4.0",
    "description": "woman gesturing NO: dark skin tone"
  },
  {
    "code_point": "1F646",
    "status": "fully-qualified",
    "icon": "🙆",
    "version": "E0.6",
    "description": "person gesturing OK"
  },
  {
    "code_point": "1F646 1F3FB",
    "status": "fully-qualified",
    "icon": "🙆🏻",
    "version": "E1.0",
    "description": "person gesturing OK: light skin tone"
  },
  {
    "code_point": "1F646 1F3FC",
    "status": "fully-qualified",
    "icon": "🙆🏼",
    "version": "E1.0",
    "description": "person gesturing OK: medium-light skin tone"
  },
  {
    "code_point": "1F646 1F3FD",
    "status": "fully-qualified",
    "icon": "🙆🏽",
    "version": "E1.0",
    "description": "person gesturing OK: medium skin tone"
  },
  {
    "code_point": "1F646 1F3FE",
    "status": "fully-qualified",
    "icon": "🙆🏾",
    "version": "E1.0",
    "description": "person gesturing OK: medium-dark skin tone"
  },
  {
    "code_point": "1F646 1F3FF",
    "status": "fully-qualified",
    "icon": "🙆🏿",
    "version": "E1.0",
    "description": "person gesturing OK: dark skin tone"
  },
  {
    "code_point": "1F646 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK"
  },
  {
    "code_point": "1F646 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆‍♂",
    "version": "E4.0",
    "description": "man gesturing OK"
  },
  {
    "code_point": "1F646 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏻‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK: light skin tone"
  },
  {
    "code_point": "1F646 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆🏻‍♂",
    "version": "E4.0",
    "description": "man gesturing OK: light skin tone"
  },
  {
    "code_point": "1F646 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏼‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK: medium-light skin tone"
  },
  {
    "code_point": "1F646 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆🏼‍♂",
    "version": "E4.0",
    "description": "man gesturing OK: medium-light skin tone"
  },
  {
    "code_point": "1F646 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏽‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK: medium skin tone"
  },
  {
    "code_point": "1F646 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆🏽‍♂",
    "version": "E4.0",
    "description": "man gesturing OK: medium skin tone"
  },
  {
    "code_point": "1F646 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏾‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK: medium-dark skin tone"
  },
  {
    "code_point": "1F646 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆🏾‍♂",
    "version": "E4.0",
    "description": "man gesturing OK: medium-dark skin tone"
  },
  {
    "code_point": "1F646 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏿‍♂️",
    "version": "E4.0",
    "description": "man gesturing OK: dark skin tone"
  },
  {
    "code_point": "1F646 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙆🏿‍♂",
    "version": "E4.0",
    "description": "man gesturing OK: dark skin tone"
  },
  {
    "code_point": "1F646 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK"
  },
  {
    "code_point": "1F646 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK"
  },
  {
    "code_point": "1F646 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏻‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK: light skin tone"
  },
  {
    "code_point": "1F646 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆🏻‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK: light skin tone"
  },
  {
    "code_point": "1F646 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏼‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK: medium-light skin tone"
  },
  {
    "code_point": "1F646 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆🏼‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK: medium-light skin tone"
  },
  {
    "code_point": "1F646 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏽‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK: medium skin tone"
  },
  {
    "code_point": "1F646 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆🏽‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK: medium skin tone"
  },
  {
    "code_point": "1F646 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏾‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK: medium-dark skin tone"
  },
  {
    "code_point": "1F646 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆🏾‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK: medium-dark skin tone"
  },
  {
    "code_point": "1F646 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙆🏿‍♀️",
    "version": "E4.0",
    "description": "woman gesturing OK: dark skin tone"
  },
  {
    "code_point": "1F646 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙆🏿‍♀",
    "version": "E4.0",
    "description": "woman gesturing OK: dark skin tone"
  },
  {
    "code_point": "1F481",
    "status": "fully-qualified",
    "icon": "💁",
    "version": "E0.6",
    "description": "person tipping hand"
  },
  {
    "code_point": "1F481 1F3FB",
    "status": "fully-qualified",
    "icon": "💁🏻",
    "version": "E1.0",
    "description": "person tipping hand: light skin tone"
  },
  {
    "code_point": "1F481 1F3FC",
    "status": "fully-qualified",
    "icon": "💁🏼",
    "version": "E1.0",
    "description": "person tipping hand: medium-light skin tone"
  },
  {
    "code_point": "1F481 1F3FD",
    "status": "fully-qualified",
    "icon": "💁🏽",
    "version": "E1.0",
    "description": "person tipping hand: medium skin tone"
  },
  {
    "code_point": "1F481 1F3FE",
    "status": "fully-qualified",
    "icon": "💁🏾",
    "version": "E1.0",
    "description": "person tipping hand: medium-dark skin tone"
  },
  {
    "code_point": "1F481 1F3FF",
    "status": "fully-qualified",
    "icon": "💁🏿",
    "version": "E1.0",
    "description": "person tipping hand: dark skin tone"
  },
  {
    "code_point": "1F481 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁‍♂️",
    "version": "E4.0",
    "description": "man tipping hand"
  },
  {
    "code_point": "1F481 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁‍♂",
    "version": "E4.0",
    "description": "man tipping hand"
  },
  {
    "code_point": "1F481 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏻‍♂️",
    "version": "E4.0",
    "description": "man tipping hand: light skin tone"
  },
  {
    "code_point": "1F481 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁🏻‍♂",
    "version": "E4.0",
    "description": "man tipping hand: light skin tone"
  },
  {
    "code_point": "1F481 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏼‍♂️",
    "version": "E4.0",
    "description": "man tipping hand: medium-light skin tone"
  },
  {
    "code_point": "1F481 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁🏼‍♂",
    "version": "E4.0",
    "description": "man tipping hand: medium-light skin tone"
  },
  {
    "code_point": "1F481 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏽‍♂️",
    "version": "E4.0",
    "description": "man tipping hand: medium skin tone"
  },
  {
    "code_point": "1F481 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁🏽‍♂",
    "version": "E4.0",
    "description": "man tipping hand: medium skin tone"
  },
  {
    "code_point": "1F481 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏾‍♂️",
    "version": "E4.0",
    "description": "man tipping hand: medium-dark skin tone"
  },
  {
    "code_point": "1F481 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁🏾‍♂",
    "version": "E4.0",
    "description": "man tipping hand: medium-dark skin tone"
  },
  {
    "code_point": "1F481 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏿‍♂️",
    "version": "E4.0",
    "description": "man tipping hand: dark skin tone"
  },
  {
    "code_point": "1F481 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "💁🏿‍♂",
    "version": "E4.0",
    "description": "man tipping hand: dark skin tone"
  },
  {
    "code_point": "1F481 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand"
  },
  {
    "code_point": "1F481 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁‍♀",
    "version": "E4.0",
    "description": "woman tipping hand"
  },
  {
    "code_point": "1F481 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏻‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand: light skin tone"
  },
  {
    "code_point": "1F481 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁🏻‍♀",
    "version": "E4.0",
    "description": "woman tipping hand: light skin tone"
  },
  {
    "code_point": "1F481 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏼‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand: medium-light skin tone"
  },
  {
    "code_point": "1F481 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁🏼‍♀",
    "version": "E4.0",
    "description": "woman tipping hand: medium-light skin tone"
  },
  {
    "code_point": "1F481 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏽‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand: medium skin tone"
  },
  {
    "code_point": "1F481 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁🏽‍♀",
    "version": "E4.0",
    "description": "woman tipping hand: medium skin tone"
  },
  {
    "code_point": "1F481 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏾‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand: medium-dark skin tone"
  },
  {
    "code_point": "1F481 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁🏾‍♀",
    "version": "E4.0",
    "description": "woman tipping hand: medium-dark skin tone"
  },
  {
    "code_point": "1F481 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💁🏿‍♀️",
    "version": "E4.0",
    "description": "woman tipping hand: dark skin tone"
  },
  {
    "code_point": "1F481 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "💁🏿‍♀",
    "version": "E4.0",
    "description": "woman tipping hand: dark skin tone"
  },
  {
    "code_point": "1F64B",
    "status": "fully-qualified",
    "icon": "🙋",
    "version": "E0.6",
    "description": "person raising hand"
  },
  {
    "code_point": "1F64B 1F3FB",
    "status": "fully-qualified",
    "icon": "🙋🏻",
    "version": "E1.0",
    "description": "person raising hand: light skin tone"
  },
  {
    "code_point": "1F64B 1F3FC",
    "status": "fully-qualified",
    "icon": "🙋🏼",
    "version": "E1.0",
    "description": "person raising hand: medium-light skin tone"
  },
  {
    "code_point": "1F64B 1F3FD",
    "status": "fully-qualified",
    "icon": "🙋🏽",
    "version": "E1.0",
    "description": "person raising hand: medium skin tone"
  },
  {
    "code_point": "1F64B 1F3FE",
    "status": "fully-qualified",
    "icon": "🙋🏾",
    "version": "E1.0",
    "description": "person raising hand: medium-dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FF",
    "status": "fully-qualified",
    "icon": "🙋🏿",
    "version": "E1.0",
    "description": "person raising hand: dark skin tone"
  },
  {
    "code_point": "1F64B 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋‍♂️",
    "version": "E4.0",
    "description": "man raising hand"
  },
  {
    "code_point": "1F64B 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋‍♂",
    "version": "E4.0",
    "description": "man raising hand"
  },
  {
    "code_point": "1F64B 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏻‍♂️",
    "version": "E4.0",
    "description": "man raising hand: light skin tone"
  },
  {
    "code_point": "1F64B 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋🏻‍♂",
    "version": "E4.0",
    "description": "man raising hand: light skin tone"
  },
  {
    "code_point": "1F64B 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏼‍♂️",
    "version": "E4.0",
    "description": "man raising hand: medium-light skin tone"
  },
  {
    "code_point": "1F64B 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋🏼‍♂",
    "version": "E4.0",
    "description": "man raising hand: medium-light skin tone"
  },
  {
    "code_point": "1F64B 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏽‍♂️",
    "version": "E4.0",
    "description": "man raising hand: medium skin tone"
  },
  {
    "code_point": "1F64B 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋🏽‍♂",
    "version": "E4.0",
    "description": "man raising hand: medium skin tone"
  },
  {
    "code_point": "1F64B 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏾‍♂️",
    "version": "E4.0",
    "description": "man raising hand: medium-dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋🏾‍♂",
    "version": "E4.0",
    "description": "man raising hand: medium-dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏿‍♂️",
    "version": "E4.0",
    "description": "man raising hand: dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙋🏿‍♂",
    "version": "E4.0",
    "description": "man raising hand: dark skin tone"
  },
  {
    "code_point": "1F64B 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋‍♀️",
    "version": "E4.0",
    "description": "woman raising hand"
  },
  {
    "code_point": "1F64B 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋‍♀",
    "version": "E4.0",
    "description": "woman raising hand"
  },
  {
    "code_point": "1F64B 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏻‍♀️",
    "version": "E4.0",
    "description": "woman raising hand: light skin tone"
  },
  {
    "code_point": "1F64B 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋🏻‍♀",
    "version": "E4.0",
    "description": "woman raising hand: light skin tone"
  },
  {
    "code_point": "1F64B 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏼‍♀️",
    "version": "E4.0",
    "description": "woman raising hand: medium-light skin tone"
  },
  {
    "code_point": "1F64B 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋🏼‍♀",
    "version": "E4.0",
    "description": "woman raising hand: medium-light skin tone"
  },
  {
    "code_point": "1F64B 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏽‍♀️",
    "version": "E4.0",
    "description": "woman raising hand: medium skin tone"
  },
  {
    "code_point": "1F64B 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋🏽‍♀",
    "version": "E4.0",
    "description": "woman raising hand: medium skin tone"
  },
  {
    "code_point": "1F64B 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏾‍♀️",
    "version": "E4.0",
    "description": "woman raising hand: medium-dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋🏾‍♀",
    "version": "E4.0",
    "description": "woman raising hand: medium-dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙋🏿‍♀️",
    "version": "E4.0",
    "description": "woman raising hand: dark skin tone"
  },
  {
    "code_point": "1F64B 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙋🏿‍♀",
    "version": "E4.0",
    "description": "woman raising hand: dark skin tone"
  },
  {
    "code_point": "1F9CF",
    "status": "fully-qualified",
    "icon": "🧏",
    "version": "E12.0",
    "description": "deaf person"
  },
  {
    "code_point": "1F9CF 1F3FB",
    "status": "fully-qualified",
    "icon": "🧏🏻",
    "version": "E12.0",
    "description": "deaf person: light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FC",
    "status": "fully-qualified",
    "icon": "🧏🏼",
    "version": "E12.0",
    "description": "deaf person: medium-light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FD",
    "status": "fully-qualified",
    "icon": "🧏🏽",
    "version": "E12.0",
    "description": "deaf person: medium skin tone"
  },
  {
    "code_point": "1F9CF 1F3FE",
    "status": "fully-qualified",
    "icon": "🧏🏾",
    "version": "E12.0",
    "description": "deaf person: medium-dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FF",
    "status": "fully-qualified",
    "icon": "🧏🏿",
    "version": "E12.0",
    "description": "deaf person: dark skin tone"
  },
  {
    "code_point": "1F9CF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏‍♂️",
    "version": "E12.0",
    "description": "deaf man"
  },
  {
    "code_point": "1F9CF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏‍♂",
    "version": "E12.0",
    "description": "deaf man"
  },
  {
    "code_point": "1F9CF 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏻‍♂️",
    "version": "E12.0",
    "description": "deaf man: light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏🏻‍♂",
    "version": "E12.0",
    "description": "deaf man: light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏼‍♂️",
    "version": "E12.0",
    "description": "deaf man: medium-light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏🏼‍♂",
    "version": "E12.0",
    "description": "deaf man: medium-light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏽‍♂️",
    "version": "E12.0",
    "description": "deaf man: medium skin tone"
  },
  {
    "code_point": "1F9CF 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏🏽‍♂",
    "version": "E12.0",
    "description": "deaf man: medium skin tone"
  },
  {
    "code_point": "1F9CF 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏾‍♂️",
    "version": "E12.0",
    "description": "deaf man: medium-dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏🏾‍♂",
    "version": "E12.0",
    "description": "deaf man: medium-dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏿‍♂️",
    "version": "E12.0",
    "description": "deaf man: dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧏🏿‍♂",
    "version": "E12.0",
    "description": "deaf man: dark skin tone"
  },
  {
    "code_point": "1F9CF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏‍♀️",
    "version": "E12.0",
    "description": "deaf woman"
  },
  {
    "code_point": "1F9CF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏‍♀",
    "version": "E12.0",
    "description": "deaf woman"
  },
  {
    "code_point": "1F9CF 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏻‍♀️",
    "version": "E12.0",
    "description": "deaf woman: light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏🏻‍♀",
    "version": "E12.0",
    "description": "deaf woman: light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏼‍♀️",
    "version": "E12.0",
    "description": "deaf woman: medium-light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏🏼‍♀",
    "version": "E12.0",
    "description": "deaf woman: medium-light skin tone"
  },
  {
    "code_point": "1F9CF 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏽‍♀️",
    "version": "E12.0",
    "description": "deaf woman: medium skin tone"
  },
  {
    "code_point": "1F9CF 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏🏽‍♀",
    "version": "E12.0",
    "description": "deaf woman: medium skin tone"
  },
  {
    "code_point": "1F9CF 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏾‍♀️",
    "version": "E12.0",
    "description": "deaf woman: medium-dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏🏾‍♀",
    "version": "E12.0",
    "description": "deaf woman: medium-dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧏🏿‍♀️",
    "version": "E12.0",
    "description": "deaf woman: dark skin tone"
  },
  {
    "code_point": "1F9CF 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧏🏿‍♀",
    "version": "E12.0",
    "description": "deaf woman: dark skin tone"
  },
  {
    "code_point": "1F647",
    "status": "fully-qualified",
    "icon": "🙇",
    "version": "E0.6",
    "description": "person bowing"
  },
  {
    "code_point": "1F647 1F3FB",
    "status": "fully-qualified",
    "icon": "🙇🏻",
    "version": "E1.0",
    "description": "person bowing: light skin tone"
  },
  {
    "code_point": "1F647 1F3FC",
    "status": "fully-qualified",
    "icon": "🙇🏼",
    "version": "E1.0",
    "description": "person bowing: medium-light skin tone"
  },
  {
    "code_point": "1F647 1F3FD",
    "status": "fully-qualified",
    "icon": "🙇🏽",
    "version": "E1.0",
    "description": "person bowing: medium skin tone"
  },
  {
    "code_point": "1F647 1F3FE",
    "status": "fully-qualified",
    "icon": "🙇🏾",
    "version": "E1.0",
    "description": "person bowing: medium-dark skin tone"
  },
  {
    "code_point": "1F647 1F3FF",
    "status": "fully-qualified",
    "icon": "🙇🏿",
    "version": "E1.0",
    "description": "person bowing: dark skin tone"
  },
  {
    "code_point": "1F647 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇‍♂️",
    "version": "E4.0",
    "description": "man bowing"
  },
  {
    "code_point": "1F647 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇‍♂",
    "version": "E4.0",
    "description": "man bowing"
  },
  {
    "code_point": "1F647 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏻‍♂️",
    "version": "E4.0",
    "description": "man bowing: light skin tone"
  },
  {
    "code_point": "1F647 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇🏻‍♂",
    "version": "E4.0",
    "description": "man bowing: light skin tone"
  },
  {
    "code_point": "1F647 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏼‍♂️",
    "version": "E4.0",
    "description": "man bowing: medium-light skin tone"
  },
  {
    "code_point": "1F647 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇🏼‍♂",
    "version": "E4.0",
    "description": "man bowing: medium-light skin tone"
  },
  {
    "code_point": "1F647 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏽‍♂️",
    "version": "E4.0",
    "description": "man bowing: medium skin tone"
  },
  {
    "code_point": "1F647 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇🏽‍♂",
    "version": "E4.0",
    "description": "man bowing: medium skin tone"
  },
  {
    "code_point": "1F647 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏾‍♂️",
    "version": "E4.0",
    "description": "man bowing: medium-dark skin tone"
  },
  {
    "code_point": "1F647 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇🏾‍♂",
    "version": "E4.0",
    "description": "man bowing: medium-dark skin tone"
  },
  {
    "code_point": "1F647 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏿‍♂️",
    "version": "E4.0",
    "description": "man bowing: dark skin tone"
  },
  {
    "code_point": "1F647 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🙇🏿‍♂",
    "version": "E4.0",
    "description": "man bowing: dark skin tone"
  },
  {
    "code_point": "1F647 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇‍♀️",
    "version": "E4.0",
    "description": "woman bowing"
  },
  {
    "code_point": "1F647 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇‍♀",
    "version": "E4.0",
    "description": "woman bowing"
  },
  {
    "code_point": "1F647 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏻‍♀️",
    "version": "E4.0",
    "description": "woman bowing: light skin tone"
  },
  {
    "code_point": "1F647 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇🏻‍♀",
    "version": "E4.0",
    "description": "woman bowing: light skin tone"
  },
  {
    "code_point": "1F647 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏼‍♀️",
    "version": "E4.0",
    "description": "woman bowing: medium-light skin tone"
  },
  {
    "code_point": "1F647 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇🏼‍♀",
    "version": "E4.0",
    "description": "woman bowing: medium-light skin tone"
  },
  {
    "code_point": "1F647 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏽‍♀️",
    "version": "E4.0",
    "description": "woman bowing: medium skin tone"
  },
  {
    "code_point": "1F647 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇🏽‍♀",
    "version": "E4.0",
    "description": "woman bowing: medium skin tone"
  },
  {
    "code_point": "1F647 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏾‍♀️",
    "version": "E4.0",
    "description": "woman bowing: medium-dark skin tone"
  },
  {
    "code_point": "1F647 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇🏾‍♀",
    "version": "E4.0",
    "description": "woman bowing: medium-dark skin tone"
  },
  {
    "code_point": "1F647 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🙇🏿‍♀️",
    "version": "E4.0",
    "description": "woman bowing: dark skin tone"
  },
  {
    "code_point": "1F647 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🙇🏿‍♀",
    "version": "E4.0",
    "description": "woman bowing: dark skin tone"
  },
  {
    "code_point": "1F926",
    "status": "fully-qualified",
    "icon": "🤦",
    "version": "E3.0",
    "description": "person facepalming"
  },
  {
    "code_point": "1F926 1F3FB",
    "status": "fully-qualified",
    "icon": "🤦🏻",
    "version": "E3.0",
    "description": "person facepalming: light skin tone"
  },
  {
    "code_point": "1F926 1F3FC",
    "status": "fully-qualified",
    "icon": "🤦🏼",
    "version": "E3.0",
    "description": "person facepalming: medium-light skin tone"
  },
  {
    "code_point": "1F926 1F3FD",
    "status": "fully-qualified",
    "icon": "🤦🏽",
    "version": "E3.0",
    "description": "person facepalming: medium skin tone"
  },
  {
    "code_point": "1F926 1F3FE",
    "status": "fully-qualified",
    "icon": "🤦🏾",
    "version": "E3.0",
    "description": "person facepalming: medium-dark skin tone"
  },
  {
    "code_point": "1F926 1F3FF",
    "status": "fully-qualified",
    "icon": "🤦🏿",
    "version": "E3.0",
    "description": "person facepalming: dark skin tone"
  },
  {
    "code_point": "1F926 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦‍♂️",
    "version": "E4.0",
    "description": "man facepalming"
  },
  {
    "code_point": "1F926 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦‍♂",
    "version": "E4.0",
    "description": "man facepalming"
  },
  {
    "code_point": "1F926 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏻‍♂️",
    "version": "E4.0",
    "description": "man facepalming: light skin tone"
  },
  {
    "code_point": "1F926 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦🏻‍♂",
    "version": "E4.0",
    "description": "man facepalming: light skin tone"
  },
  {
    "code_point": "1F926 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏼‍♂️",
    "version": "E4.0",
    "description": "man facepalming: medium-light skin tone"
  },
  {
    "code_point": "1F926 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦🏼‍♂",
    "version": "E4.0",
    "description": "man facepalming: medium-light skin tone"
  },
  {
    "code_point": "1F926 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏽‍♂️",
    "version": "E4.0",
    "description": "man facepalming: medium skin tone"
  },
  {
    "code_point": "1F926 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦🏽‍♂",
    "version": "E4.0",
    "description": "man facepalming: medium skin tone"
  },
  {
    "code_point": "1F926 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏾‍♂️",
    "version": "E4.0",
    "description": "man facepalming: medium-dark skin tone"
  },
  {
    "code_point": "1F926 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦🏾‍♂",
    "version": "E4.0",
    "description": "man facepalming: medium-dark skin tone"
  },
  {
    "code_point": "1F926 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏿‍♂️",
    "version": "E4.0",
    "description": "man facepalming: dark skin tone"
  },
  {
    "code_point": "1F926 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤦🏿‍♂",
    "version": "E4.0",
    "description": "man facepalming: dark skin tone"
  },
  {
    "code_point": "1F926 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦‍♀️",
    "version": "E4.0",
    "description": "woman facepalming"
  },
  {
    "code_point": "1F926 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦‍♀",
    "version": "E4.0",
    "description": "woman facepalming"
  },
  {
    "code_point": "1F926 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏻‍♀️",
    "version": "E4.0",
    "description": "woman facepalming: light skin tone"
  },
  {
    "code_point": "1F926 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦🏻‍♀",
    "version": "E4.0",
    "description": "woman facepalming: light skin tone"
  },
  {
    "code_point": "1F926 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏼‍♀️",
    "version": "E4.0",
    "description": "woman facepalming: medium-light skin tone"
  },
  {
    "code_point": "1F926 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦🏼‍♀",
    "version": "E4.0",
    "description": "woman facepalming: medium-light skin tone"
  },
  {
    "code_point": "1F926 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏽‍♀️",
    "version": "E4.0",
    "description": "woman facepalming: medium skin tone"
  },
  {
    "code_point": "1F926 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦🏽‍♀",
    "version": "E4.0",
    "description": "woman facepalming: medium skin tone"
  },
  {
    "code_point": "1F926 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏾‍♀️",
    "version": "E4.0",
    "description": "woman facepalming: medium-dark skin tone"
  },
  {
    "code_point": "1F926 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦🏾‍♀",
    "version": "E4.0",
    "description": "woman facepalming: medium-dark skin tone"
  },
  {
    "code_point": "1F926 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤦🏿‍♀️",
    "version": "E4.0",
    "description": "woman facepalming: dark skin tone"
  },
  {
    "code_point": "1F926 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤦🏿‍♀",
    "version": "E4.0",
    "description": "woman facepalming: dark skin tone"
  },
  {
    "code_point": "1F937",
    "status": "fully-qualified",
    "icon": "🤷",
    "version": "E3.0",
    "description": "person shrugging"
  },
  {
    "code_point": "1F937 1F3FB",
    "status": "fully-qualified",
    "icon": "🤷🏻",
    "version": "E3.0",
    "description": "person shrugging: light skin tone"
  },
  {
    "code_point": "1F937 1F3FC",
    "status": "fully-qualified",
    "icon": "🤷🏼",
    "version": "E3.0",
    "description": "person shrugging: medium-light skin tone"
  },
  {
    "code_point": "1F937 1F3FD",
    "status": "fully-qualified",
    "icon": "🤷🏽",
    "version": "E3.0",
    "description": "person shrugging: medium skin tone"
  },
  {
    "code_point": "1F937 1F3FE",
    "status": "fully-qualified",
    "icon": "🤷🏾",
    "version": "E3.0",
    "description": "person shrugging: medium-dark skin tone"
  },
  {
    "code_point": "1F937 1F3FF",
    "status": "fully-qualified",
    "icon": "🤷🏿",
    "version": "E3.0",
    "description": "person shrugging: dark skin tone"
  },
  {
    "code_point": "1F937 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷‍♂️",
    "version": "E4.0",
    "description": "man shrugging"
  },
  {
    "code_point": "1F937 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷‍♂",
    "version": "E4.0",
    "description": "man shrugging"
  },
  {
    "code_point": "1F937 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏻‍♂️",
    "version": "E4.0",
    "description": "man shrugging: light skin tone"
  },
  {
    "code_point": "1F937 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷🏻‍♂",
    "version": "E4.0",
    "description": "man shrugging: light skin tone"
  },
  {
    "code_point": "1F937 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏼‍♂️",
    "version": "E4.0",
    "description": "man shrugging: medium-light skin tone"
  },
  {
    "code_point": "1F937 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷🏼‍♂",
    "version": "E4.0",
    "description": "man shrugging: medium-light skin tone"
  },
  {
    "code_point": "1F937 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏽‍♂️",
    "version": "E4.0",
    "description": "man shrugging: medium skin tone"
  },
  {
    "code_point": "1F937 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷🏽‍♂",
    "version": "E4.0",
    "description": "man shrugging: medium skin tone"
  },
  {
    "code_point": "1F937 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏾‍♂️",
    "version": "E4.0",
    "description": "man shrugging: medium-dark skin tone"
  },
  {
    "code_point": "1F937 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷🏾‍♂",
    "version": "E4.0",
    "description": "man shrugging: medium-dark skin tone"
  },
  {
    "code_point": "1F937 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏿‍♂️",
    "version": "E4.0",
    "description": "man shrugging: dark skin tone"
  },
  {
    "code_point": "1F937 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤷🏿‍♂",
    "version": "E4.0",
    "description": "man shrugging: dark skin tone"
  },
  {
    "code_point": "1F937 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷‍♀️",
    "version": "E4.0",
    "description": "woman shrugging"
  },
  {
    "code_point": "1F937 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷‍♀",
    "version": "E4.0",
    "description": "woman shrugging"
  },
  {
    "code_point": "1F937 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏻‍♀️",
    "version": "E4.0",
    "description": "woman shrugging: light skin tone"
  },
  {
    "code_point": "1F937 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷🏻‍♀",
    "version": "E4.0",
    "description": "woman shrugging: light skin tone"
  },
  {
    "code_point": "1F937 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏼‍♀️",
    "version": "E4.0",
    "description": "woman shrugging: medium-light skin tone"
  },
  {
    "code_point": "1F937 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷🏼‍♀",
    "version": "E4.0",
    "description": "woman shrugging: medium-light skin tone"
  },
  {
    "code_point": "1F937 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏽‍♀️",
    "version": "E4.0",
    "description": "woman shrugging: medium skin tone"
  },
  {
    "code_point": "1F937 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷🏽‍♀",
    "version": "E4.0",
    "description": "woman shrugging: medium skin tone"
  },
  {
    "code_point": "1F937 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏾‍♀️",
    "version": "E4.0",
    "description": "woman shrugging: medium-dark skin tone"
  },
  {
    "code_point": "1F937 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷🏾‍♀",
    "version": "E4.0",
    "description": "woman shrugging: medium-dark skin tone"
  },
  {
    "code_point": "1F937 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤷🏿‍♀️",
    "version": "E4.0",
    "description": "woman shrugging: dark skin tone"
  },
  {
    "code_point": "1F937 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤷🏿‍♀",
    "version": "E4.0",
    "description": "woman shrugging: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍⚕️",
    "version": "E12.1",
    "description": "health worker"
  },
  {
    "code_point": "1F9D1 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑‍⚕",
    "version": "E12.1",
    "description": "health worker"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍⚕️",
    "version": "E12.1",
    "description": "health worker: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍⚕",
    "version": "E12.1",
    "description": "health worker: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍⚕️",
    "version": "E12.1",
    "description": "health worker: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍⚕",
    "version": "E12.1",
    "description": "health worker: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍⚕️",
    "version": "E12.1",
    "description": "health worker: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍⚕",
    "version": "E12.1",
    "description": "health worker: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍⚕️",
    "version": "E12.1",
    "description": "health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍⚕",
    "version": "E12.1",
    "description": "health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍⚕️",
    "version": "E12.1",
    "description": "health worker: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2695",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍⚕",
    "version": "E12.1",
    "description": "health worker: dark skin tone"
  },
  {
    "code_point": "1F468 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍⚕️",
    "version": "E4.0",
    "description": "man health worker"
  },
  {
    "code_point": "1F468 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨‍⚕",
    "version": "E4.0",
    "description": "man health worker"
  },
  {
    "code_point": "1F468 1F3FB 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍⚕️",
    "version": "E4.0",
    "description": "man health worker: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨🏻‍⚕",
    "version": "E4.0",
    "description": "man health worker: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍⚕️",
    "version": "E4.0",
    "description": "man health worker: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨🏼‍⚕",
    "version": "E4.0",
    "description": "man health worker: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍⚕️",
    "version": "E4.0",
    "description": "man health worker: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨🏽‍⚕",
    "version": "E4.0",
    "description": "man health worker: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍⚕️",
    "version": "E4.0",
    "description": "man health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨🏾‍⚕",
    "version": "E4.0",
    "description": "man health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍⚕️",
    "version": "E4.0",
    "description": "man health worker: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2695",
    "status": "minimally-qualified",
    "icon": "👨🏿‍⚕",
    "version": "E4.0",
    "description": "man health worker: dark skin tone"
  },
  {
    "code_point": "1F469 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍⚕️",
    "version": "E4.0",
    "description": "woman health worker"
  },
  {
    "code_point": "1F469 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩‍⚕",
    "version": "E4.0",
    "description": "woman health worker"
  },
  {
    "code_point": "1F469 1F3FB 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍⚕️",
    "version": "E4.0",
    "description": "woman health worker: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩🏻‍⚕",
    "version": "E4.0",
    "description": "woman health worker: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍⚕️",
    "version": "E4.0",
    "description": "woman health worker: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩🏼‍⚕",
    "version": "E4.0",
    "description": "woman health worker: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍⚕️",
    "version": "E4.0",
    "description": "woman health worker: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩🏽‍⚕",
    "version": "E4.0",
    "description": "woman health worker: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍⚕️",
    "version": "E4.0",
    "description": "woman health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩🏾‍⚕",
    "version": "E4.0",
    "description": "woman health worker: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2695 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍⚕️",
    "version": "E4.0",
    "description": "woman health worker: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2695",
    "status": "minimally-qualified",
    "icon": "👩🏿‍⚕",
    "version": "E4.0",
    "description": "woman health worker: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑‍🎓",
    "version": "E12.1",
    "description": "student"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🎓",
    "version": "E12.1",
    "description": "student: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🎓",
    "version": "E12.1",
    "description": "student: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🎓",
    "version": "E12.1",
    "description": "student: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🎓",
    "version": "E12.1",
    "description": "student: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F393",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🎓",
    "version": "E12.1",
    "description": "student: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨‍🎓",
    "version": "E4.0",
    "description": "man student"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨🏻‍🎓",
    "version": "E4.0",
    "description": "man student: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨🏼‍🎓",
    "version": "E4.0",
    "description": "man student: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨🏽‍🎓",
    "version": "E4.0",
    "description": "man student: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨🏾‍🎓",
    "version": "E4.0",
    "description": "man student: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F393",
    "status": "fully-qualified",
    "icon": "👨🏿‍🎓",
    "version": "E4.0",
    "description": "man student: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩‍🎓",
    "version": "E4.0",
    "description": "woman student"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩🏻‍🎓",
    "version": "E4.0",
    "description": "woman student: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩🏼‍🎓",
    "version": "E4.0",
    "description": "woman student: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩🏽‍🎓",
    "version": "E4.0",
    "description": "woman student: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩🏾‍🎓",
    "version": "E4.0",
    "description": "woman student: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F393",
    "status": "fully-qualified",
    "icon": "👩🏿‍🎓",
    "version": "E4.0",
    "description": "woman student: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑‍🏫",
    "version": "E12.1",
    "description": "teacher"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🏫",
    "version": "E12.1",
    "description": "teacher: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🏫",
    "version": "E12.1",
    "description": "teacher: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🏫",
    "version": "E12.1",
    "description": "teacher: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🏫",
    "version": "E12.1",
    "description": "teacher: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🏫",
    "version": "E12.1",
    "description": "teacher: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨‍🏫",
    "version": "E4.0",
    "description": "man teacher"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨🏻‍🏫",
    "version": "E4.0",
    "description": "man teacher: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨🏼‍🏫",
    "version": "E4.0",
    "description": "man teacher: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨🏽‍🏫",
    "version": "E4.0",
    "description": "man teacher: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨🏾‍🏫",
    "version": "E4.0",
    "description": "man teacher: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👨🏿‍🏫",
    "version": "E4.0",
    "description": "man teacher: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩‍🏫",
    "version": "E4.0",
    "description": "woman teacher"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩🏻‍🏫",
    "version": "E4.0",
    "description": "woman teacher: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩🏼‍🏫",
    "version": "E4.0",
    "description": "woman teacher: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩🏽‍🏫",
    "version": "E4.0",
    "description": "woman teacher: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩🏾‍🏫",
    "version": "E4.0",
    "description": "woman teacher: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F3EB",
    "status": "fully-qualified",
    "icon": "👩🏿‍🏫",
    "version": "E4.0",
    "description": "woman teacher: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍⚖️",
    "version": "E12.1",
    "description": "judge"
  },
  {
    "code_point": "1F9D1 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑‍⚖",
    "version": "E12.1",
    "description": "judge"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍⚖️",
    "version": "E12.1",
    "description": "judge: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍⚖",
    "version": "E12.1",
    "description": "judge: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍⚖️",
    "version": "E12.1",
    "description": "judge: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍⚖",
    "version": "E12.1",
    "description": "judge: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍⚖️",
    "version": "E12.1",
    "description": "judge: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍⚖",
    "version": "E12.1",
    "description": "judge: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍⚖️",
    "version": "E12.1",
    "description": "judge: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍⚖",
    "version": "E12.1",
    "description": "judge: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍⚖️",
    "version": "E12.1",
    "description": "judge: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2696",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍⚖",
    "version": "E12.1",
    "description": "judge: dark skin tone"
  },
  {
    "code_point": "1F468 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍⚖️",
    "version": "E4.0",
    "description": "man judge"
  },
  {
    "code_point": "1F468 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨‍⚖",
    "version": "E4.0",
    "description": "man judge"
  },
  {
    "code_point": "1F468 1F3FB 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍⚖️",
    "version": "E4.0",
    "description": "man judge: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨🏻‍⚖",
    "version": "E4.0",
    "description": "man judge: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍⚖️",
    "version": "E4.0",
    "description": "man judge: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨🏼‍⚖",
    "version": "E4.0",
    "description": "man judge: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍⚖️",
    "version": "E4.0",
    "description": "man judge: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨🏽‍⚖",
    "version": "E4.0",
    "description": "man judge: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍⚖️",
    "version": "E4.0",
    "description": "man judge: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨🏾‍⚖",
    "version": "E4.0",
    "description": "man judge: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍⚖️",
    "version": "E4.0",
    "description": "man judge: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2696",
    "status": "minimally-qualified",
    "icon": "👨🏿‍⚖",
    "version": "E4.0",
    "description": "man judge: dark skin tone"
  },
  {
    "code_point": "1F469 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍⚖️",
    "version": "E4.0",
    "description": "woman judge"
  },
  {
    "code_point": "1F469 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩‍⚖",
    "version": "E4.0",
    "description": "woman judge"
  },
  {
    "code_point": "1F469 1F3FB 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍⚖️",
    "version": "E4.0",
    "description": "woman judge: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩🏻‍⚖",
    "version": "E4.0",
    "description": "woman judge: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍⚖️",
    "version": "E4.0",
    "description": "woman judge: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩🏼‍⚖",
    "version": "E4.0",
    "description": "woman judge: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍⚖️",
    "version": "E4.0",
    "description": "woman judge: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩🏽‍⚖",
    "version": "E4.0",
    "description": "woman judge: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍⚖️",
    "version": "E4.0",
    "description": "woman judge: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩🏾‍⚖",
    "version": "E4.0",
    "description": "woman judge: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2696 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍⚖️",
    "version": "E4.0",
    "description": "woman judge: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2696",
    "status": "minimally-qualified",
    "icon": "👩🏿‍⚖",
    "version": "E4.0",
    "description": "woman judge: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑‍🌾",
    "version": "E12.1",
    "description": "farmer"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🌾",
    "version": "E12.1",
    "description": "farmer: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🌾",
    "version": "E12.1",
    "description": "farmer: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🌾",
    "version": "E12.1",
    "description": "farmer: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🌾",
    "version": "E12.1",
    "description": "farmer: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F33E",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🌾",
    "version": "E12.1",
    "description": "farmer: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨‍🌾",
    "version": "E4.0",
    "description": "man farmer"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨🏻‍🌾",
    "version": "E4.0",
    "description": "man farmer: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨🏼‍🌾",
    "version": "E4.0",
    "description": "man farmer: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨🏽‍🌾",
    "version": "E4.0",
    "description": "man farmer: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨🏾‍🌾",
    "version": "E4.0",
    "description": "man farmer: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👨🏿‍🌾",
    "version": "E4.0",
    "description": "man farmer: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩‍🌾",
    "version": "E4.0",
    "description": "woman farmer"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩🏻‍🌾",
    "version": "E4.0",
    "description": "woman farmer: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩🏼‍🌾",
    "version": "E4.0",
    "description": "woman farmer: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩🏽‍🌾",
    "version": "E4.0",
    "description": "woman farmer: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩🏾‍🌾",
    "version": "E4.0",
    "description": "woman farmer: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F33E",
    "status": "fully-qualified",
    "icon": "👩🏿‍🌾",
    "version": "E4.0",
    "description": "woman farmer: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑‍🍳",
    "version": "E12.1",
    "description": "cook"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🍳",
    "version": "E12.1",
    "description": "cook: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🍳",
    "version": "E12.1",
    "description": "cook: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🍳",
    "version": "E12.1",
    "description": "cook: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🍳",
    "version": "E12.1",
    "description": "cook: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F373",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🍳",
    "version": "E12.1",
    "description": "cook: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨‍🍳",
    "version": "E4.0",
    "description": "man cook"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨🏻‍🍳",
    "version": "E4.0",
    "description": "man cook: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨🏼‍🍳",
    "version": "E4.0",
    "description": "man cook: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨🏽‍🍳",
    "version": "E4.0",
    "description": "man cook: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨🏾‍🍳",
    "version": "E4.0",
    "description": "man cook: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F373",
    "status": "fully-qualified",
    "icon": "👨🏿‍🍳",
    "version": "E4.0",
    "description": "man cook: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩‍🍳",
    "version": "E4.0",
    "description": "woman cook"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩🏻‍🍳",
    "version": "E4.0",
    "description": "woman cook: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩🏼‍🍳",
    "version": "E4.0",
    "description": "woman cook: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩🏽‍🍳",
    "version": "E4.0",
    "description": "woman cook: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩🏾‍🍳",
    "version": "E4.0",
    "description": "woman cook: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F373",
    "status": "fully-qualified",
    "icon": "👩🏿‍🍳",
    "version": "E4.0",
    "description": "woman cook: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑‍🔧",
    "version": "E12.1",
    "description": "mechanic"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🔧",
    "version": "E12.1",
    "description": "mechanic: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🔧",
    "version": "E12.1",
    "description": "mechanic: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🔧",
    "version": "E12.1",
    "description": "mechanic: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🔧",
    "version": "E12.1",
    "description": "mechanic: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F527",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🔧",
    "version": "E12.1",
    "description": "mechanic: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨‍🔧",
    "version": "E4.0",
    "description": "man mechanic"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨🏻‍🔧",
    "version": "E4.0",
    "description": "man mechanic: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨🏼‍🔧",
    "version": "E4.0",
    "description": "man mechanic: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨🏽‍🔧",
    "version": "E4.0",
    "description": "man mechanic: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨🏾‍🔧",
    "version": "E4.0",
    "description": "man mechanic: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F527",
    "status": "fully-qualified",
    "icon": "👨🏿‍🔧",
    "version": "E4.0",
    "description": "man mechanic: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩‍🔧",
    "version": "E4.0",
    "description": "woman mechanic"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩🏻‍🔧",
    "version": "E4.0",
    "description": "woman mechanic: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩🏼‍🔧",
    "version": "E4.0",
    "description": "woman mechanic: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩🏽‍🔧",
    "version": "E4.0",
    "description": "woman mechanic: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩🏾‍🔧",
    "version": "E4.0",
    "description": "woman mechanic: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F527",
    "status": "fully-qualified",
    "icon": "👩🏿‍🔧",
    "version": "E4.0",
    "description": "woman mechanic: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑‍🏭",
    "version": "E12.1",
    "description": "factory worker"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🏭",
    "version": "E12.1",
    "description": "factory worker: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🏭",
    "version": "E12.1",
    "description": "factory worker: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🏭",
    "version": "E12.1",
    "description": "factory worker: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🏭",
    "version": "E12.1",
    "description": "factory worker: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🏭",
    "version": "E12.1",
    "description": "factory worker: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨‍🏭",
    "version": "E4.0",
    "description": "man factory worker"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨🏻‍🏭",
    "version": "E4.0",
    "description": "man factory worker: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨🏼‍🏭",
    "version": "E4.0",
    "description": "man factory worker: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨🏽‍🏭",
    "version": "E4.0",
    "description": "man factory worker: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨🏾‍🏭",
    "version": "E4.0",
    "description": "man factory worker: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👨🏿‍🏭",
    "version": "E4.0",
    "description": "man factory worker: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩‍🏭",
    "version": "E4.0",
    "description": "woman factory worker"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩🏻‍🏭",
    "version": "E4.0",
    "description": "woman factory worker: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩🏼‍🏭",
    "version": "E4.0",
    "description": "woman factory worker: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩🏽‍🏭",
    "version": "E4.0",
    "description": "woman factory worker: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩🏾‍🏭",
    "version": "E4.0",
    "description": "woman factory worker: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F3ED",
    "status": "fully-qualified",
    "icon": "👩🏿‍🏭",
    "version": "E4.0",
    "description": "woman factory worker: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑‍💼",
    "version": "E12.1",
    "description": "office worker"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑🏻‍💼",
    "version": "E12.1",
    "description": "office worker: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑🏼‍💼",
    "version": "E12.1",
    "description": "office worker: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑🏽‍💼",
    "version": "E12.1",
    "description": "office worker: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑🏾‍💼",
    "version": "E12.1",
    "description": "office worker: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "🧑🏿‍💼",
    "version": "E12.1",
    "description": "office worker: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨‍💼",
    "version": "E4.0",
    "description": "man office worker"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨🏻‍💼",
    "version": "E4.0",
    "description": "man office worker: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨🏼‍💼",
    "version": "E4.0",
    "description": "man office worker: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨🏽‍💼",
    "version": "E4.0",
    "description": "man office worker: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨🏾‍💼",
    "version": "E4.0",
    "description": "man office worker: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👨🏿‍💼",
    "version": "E4.0",
    "description": "man office worker: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩‍💼",
    "version": "E4.0",
    "description": "woman office worker"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩🏻‍💼",
    "version": "E4.0",
    "description": "woman office worker: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩🏼‍💼",
    "version": "E4.0",
    "description": "woman office worker: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩🏽‍💼",
    "version": "E4.0",
    "description": "woman office worker: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩🏾‍💼",
    "version": "E4.0",
    "description": "woman office worker: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F4BC",
    "status": "fully-qualified",
    "icon": "👩🏿‍💼",
    "version": "E4.0",
    "description": "woman office worker: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑‍🔬",
    "version": "E12.1",
    "description": "scientist"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🔬",
    "version": "E12.1",
    "description": "scientist: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🔬",
    "version": "E12.1",
    "description": "scientist: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🔬",
    "version": "E12.1",
    "description": "scientist: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🔬",
    "version": "E12.1",
    "description": "scientist: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F52C",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🔬",
    "version": "E12.1",
    "description": "scientist: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨‍🔬",
    "version": "E4.0",
    "description": "man scientist"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨🏻‍🔬",
    "version": "E4.0",
    "description": "man scientist: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨🏼‍🔬",
    "version": "E4.0",
    "description": "man scientist: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨🏽‍🔬",
    "version": "E4.0",
    "description": "man scientist: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨🏾‍🔬",
    "version": "E4.0",
    "description": "man scientist: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👨🏿‍🔬",
    "version": "E4.0",
    "description": "man scientist: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩‍🔬",
    "version": "E4.0",
    "description": "woman scientist"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩🏻‍🔬",
    "version": "E4.0",
    "description": "woman scientist: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩🏼‍🔬",
    "version": "E4.0",
    "description": "woman scientist: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩🏽‍🔬",
    "version": "E4.0",
    "description": "woman scientist: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩🏾‍🔬",
    "version": "E4.0",
    "description": "woman scientist: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F52C",
    "status": "fully-qualified",
    "icon": "👩🏿‍🔬",
    "version": "E4.0",
    "description": "woman scientist: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑‍💻",
    "version": "E12.1",
    "description": "technologist"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑🏻‍💻",
    "version": "E12.1",
    "description": "technologist: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑🏼‍💻",
    "version": "E12.1",
    "description": "technologist: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑🏽‍💻",
    "version": "E12.1",
    "description": "technologist: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑🏾‍💻",
    "version": "E12.1",
    "description": "technologist: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "🧑🏿‍💻",
    "version": "E12.1",
    "description": "technologist: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨‍💻",
    "version": "E4.0",
    "description": "man technologist"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨🏻‍💻",
    "version": "E4.0",
    "description": "man technologist: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨🏼‍💻",
    "version": "E4.0",
    "description": "man technologist: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨🏽‍💻",
    "version": "E4.0",
    "description": "man technologist: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨🏾‍💻",
    "version": "E4.0",
    "description": "man technologist: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👨🏿‍💻",
    "version": "E4.0",
    "description": "man technologist: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩‍💻",
    "version": "E4.0",
    "description": "woman technologist"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩🏻‍💻",
    "version": "E4.0",
    "description": "woman technologist: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩🏼‍💻",
    "version": "E4.0",
    "description": "woman technologist: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩🏽‍💻",
    "version": "E4.0",
    "description": "woman technologist: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩🏾‍💻",
    "version": "E4.0",
    "description": "woman technologist: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F4BB",
    "status": "fully-qualified",
    "icon": "👩🏿‍💻",
    "version": "E4.0",
    "description": "woman technologist: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑‍🎤",
    "version": "E12.1",
    "description": "singer"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🎤",
    "version": "E12.1",
    "description": "singer: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🎤",
    "version": "E12.1",
    "description": "singer: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🎤",
    "version": "E12.1",
    "description": "singer: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🎤",
    "version": "E12.1",
    "description": "singer: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🎤",
    "version": "E12.1",
    "description": "singer: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨‍🎤",
    "version": "E4.0",
    "description": "man singer"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨🏻‍🎤",
    "version": "E4.0",
    "description": "man singer: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨🏼‍🎤",
    "version": "E4.0",
    "description": "man singer: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨🏽‍🎤",
    "version": "E4.0",
    "description": "man singer: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨🏾‍🎤",
    "version": "E4.0",
    "description": "man singer: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👨🏿‍🎤",
    "version": "E4.0",
    "description": "man singer: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩‍🎤",
    "version": "E4.0",
    "description": "woman singer"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩🏻‍🎤",
    "version": "E4.0",
    "description": "woman singer: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩🏼‍🎤",
    "version": "E4.0",
    "description": "woman singer: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩🏽‍🎤",
    "version": "E4.0",
    "description": "woman singer: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩🏾‍🎤",
    "version": "E4.0",
    "description": "woman singer: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F3A4",
    "status": "fully-qualified",
    "icon": "👩🏿‍🎤",
    "version": "E4.0",
    "description": "woman singer: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑‍🎨",
    "version": "E12.1",
    "description": "artist"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🎨",
    "version": "E12.1",
    "description": "artist: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🎨",
    "version": "E12.1",
    "description": "artist: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🎨",
    "version": "E12.1",
    "description": "artist: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🎨",
    "version": "E12.1",
    "description": "artist: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🎨",
    "version": "E12.1",
    "description": "artist: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨‍🎨",
    "version": "E4.0",
    "description": "man artist"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨🏻‍🎨",
    "version": "E4.0",
    "description": "man artist: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨🏼‍🎨",
    "version": "E4.0",
    "description": "man artist: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨🏽‍🎨",
    "version": "E4.0",
    "description": "man artist: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨🏾‍🎨",
    "version": "E4.0",
    "description": "man artist: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👨🏿‍🎨",
    "version": "E4.0",
    "description": "man artist: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩‍🎨",
    "version": "E4.0",
    "description": "woman artist"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩🏻‍🎨",
    "version": "E4.0",
    "description": "woman artist: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩🏼‍🎨",
    "version": "E4.0",
    "description": "woman artist: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩🏽‍🎨",
    "version": "E4.0",
    "description": "woman artist: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩🏾‍🎨",
    "version": "E4.0",
    "description": "woman artist: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F3A8",
    "status": "fully-qualified",
    "icon": "👩🏿‍🎨",
    "version": "E4.0",
    "description": "woman artist: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍✈️",
    "version": "E12.1",
    "description": "pilot"
  },
  {
    "code_point": "1F9D1 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑‍✈",
    "version": "E12.1",
    "description": "pilot"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍✈️",
    "version": "E12.1",
    "description": "pilot: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍✈",
    "version": "E12.1",
    "description": "pilot: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍✈️",
    "version": "E12.1",
    "description": "pilot: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍✈",
    "version": "E12.1",
    "description": "pilot: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍✈️",
    "version": "E12.1",
    "description": "pilot: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍✈",
    "version": "E12.1",
    "description": "pilot: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍✈️",
    "version": "E12.1",
    "description": "pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍✈",
    "version": "E12.1",
    "description": "pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍✈️",
    "version": "E12.1",
    "description": "pilot: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2708",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍✈",
    "version": "E12.1",
    "description": "pilot: dark skin tone"
  },
  {
    "code_point": "1F468 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍✈️",
    "version": "E4.0",
    "description": "man pilot"
  },
  {
    "code_point": "1F468 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨‍✈",
    "version": "E4.0",
    "description": "man pilot"
  },
  {
    "code_point": "1F468 1F3FB 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍✈️",
    "version": "E4.0",
    "description": "man pilot: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨🏻‍✈",
    "version": "E4.0",
    "description": "man pilot: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍✈️",
    "version": "E4.0",
    "description": "man pilot: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨🏼‍✈",
    "version": "E4.0",
    "description": "man pilot: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍✈️",
    "version": "E4.0",
    "description": "man pilot: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨🏽‍✈",
    "version": "E4.0",
    "description": "man pilot: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍✈️",
    "version": "E4.0",
    "description": "man pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨🏾‍✈",
    "version": "E4.0",
    "description": "man pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍✈️",
    "version": "E4.0",
    "description": "man pilot: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2708",
    "status": "minimally-qualified",
    "icon": "👨🏿‍✈",
    "version": "E4.0",
    "description": "man pilot: dark skin tone"
  },
  {
    "code_point": "1F469 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍✈️",
    "version": "E4.0",
    "description": "woman pilot"
  },
  {
    "code_point": "1F469 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩‍✈",
    "version": "E4.0",
    "description": "woman pilot"
  },
  {
    "code_point": "1F469 1F3FB 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍✈️",
    "version": "E4.0",
    "description": "woman pilot: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩🏻‍✈",
    "version": "E4.0",
    "description": "woman pilot: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍✈️",
    "version": "E4.0",
    "description": "woman pilot: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩🏼‍✈",
    "version": "E4.0",
    "description": "woman pilot: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍✈️",
    "version": "E4.0",
    "description": "woman pilot: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩🏽‍✈",
    "version": "E4.0",
    "description": "woman pilot: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍✈️",
    "version": "E4.0",
    "description": "woman pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩🏾‍✈",
    "version": "E4.0",
    "description": "woman pilot: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2708 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍✈️",
    "version": "E4.0",
    "description": "woman pilot: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2708",
    "status": "minimally-qualified",
    "icon": "👩🏿‍✈",
    "version": "E4.0",
    "description": "woman pilot: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑‍🚀",
    "version": "E12.1",
    "description": "astronaut"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🚀",
    "version": "E12.1",
    "description": "astronaut: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🚀",
    "version": "E12.1",
    "description": "astronaut: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🚀",
    "version": "E12.1",
    "description": "astronaut: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🚀",
    "version": "E12.1",
    "description": "astronaut: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F680",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🚀",
    "version": "E12.1",
    "description": "astronaut: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨‍🚀",
    "version": "E4.0",
    "description": "man astronaut"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨🏻‍🚀",
    "version": "E4.0",
    "description": "man astronaut: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨🏼‍🚀",
    "version": "E4.0",
    "description": "man astronaut: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨🏽‍🚀",
    "version": "E4.0",
    "description": "man astronaut: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨🏾‍🚀",
    "version": "E4.0",
    "description": "man astronaut: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F680",
    "status": "fully-qualified",
    "icon": "👨🏿‍🚀",
    "version": "E4.0",
    "description": "man astronaut: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩‍🚀",
    "version": "E4.0",
    "description": "woman astronaut"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩🏻‍🚀",
    "version": "E4.0",
    "description": "woman astronaut: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩🏼‍🚀",
    "version": "E4.0",
    "description": "woman astronaut: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩🏽‍🚀",
    "version": "E4.0",
    "description": "woman astronaut: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩🏾‍🚀",
    "version": "E4.0",
    "description": "woman astronaut: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F680",
    "status": "fully-qualified",
    "icon": "👩🏿‍🚀",
    "version": "E4.0",
    "description": "woman astronaut: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑‍🚒",
    "version": "E12.1",
    "description": "firefighter"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🚒",
    "version": "E12.1",
    "description": "firefighter: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🚒",
    "version": "E12.1",
    "description": "firefighter: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🚒",
    "version": "E12.1",
    "description": "firefighter: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🚒",
    "version": "E12.1",
    "description": "firefighter: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F692",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🚒",
    "version": "E12.1",
    "description": "firefighter: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨‍🚒",
    "version": "E4.0",
    "description": "man firefighter"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨🏻‍🚒",
    "version": "E4.0",
    "description": "man firefighter: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨🏼‍🚒",
    "version": "E4.0",
    "description": "man firefighter: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨🏽‍🚒",
    "version": "E4.0",
    "description": "man firefighter: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨🏾‍🚒",
    "version": "E4.0",
    "description": "man firefighter: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F692",
    "status": "fully-qualified",
    "icon": "👨🏿‍🚒",
    "version": "E4.0",
    "description": "man firefighter: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩‍🚒",
    "version": "E4.0",
    "description": "woman firefighter"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩🏻‍🚒",
    "version": "E4.0",
    "description": "woman firefighter: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩🏼‍🚒",
    "version": "E4.0",
    "description": "woman firefighter: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩🏽‍🚒",
    "version": "E4.0",
    "description": "woman firefighter: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩🏾‍🚒",
    "version": "E4.0",
    "description": "woman firefighter: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F692",
    "status": "fully-qualified",
    "icon": "👩🏿‍🚒",
    "version": "E4.0",
    "description": "woman firefighter: dark skin tone"
  },
  {
    "code_point": "1F46E",
    "status": "fully-qualified",
    "icon": "👮",
    "version": "E0.6",
    "description": "police officer"
  },
  {
    "code_point": "1F46E 1F3FB",
    "status": "fully-qualified",
    "icon": "👮🏻",
    "version": "E1.0",
    "description": "police officer: light skin tone"
  },
  {
    "code_point": "1F46E 1F3FC",
    "status": "fully-qualified",
    "icon": "👮🏼",
    "version": "E1.0",
    "description": "police officer: medium-light skin tone"
  },
  {
    "code_point": "1F46E 1F3FD",
    "status": "fully-qualified",
    "icon": "👮🏽",
    "version": "E1.0",
    "description": "police officer: medium skin tone"
  },
  {
    "code_point": "1F46E 1F3FE",
    "status": "fully-qualified",
    "icon": "👮🏾",
    "version": "E1.0",
    "description": "police officer: medium-dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FF",
    "status": "fully-qualified",
    "icon": "👮🏿",
    "version": "E1.0",
    "description": "police officer: dark skin tone"
  },
  {
    "code_point": "1F46E 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮‍♂️",
    "version": "E4.0",
    "description": "man police officer"
  },
  {
    "code_point": "1F46E 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮‍♂",
    "version": "E4.0",
    "description": "man police officer"
  },
  {
    "code_point": "1F46E 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏻‍♂️",
    "version": "E4.0",
    "description": "man police officer: light skin tone"
  },
  {
    "code_point": "1F46E 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮🏻‍♂",
    "version": "E4.0",
    "description": "man police officer: light skin tone"
  },
  {
    "code_point": "1F46E 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏼‍♂️",
    "version": "E4.0",
    "description": "man police officer: medium-light skin tone"
  },
  {
    "code_point": "1F46E 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮🏼‍♂",
    "version": "E4.0",
    "description": "man police officer: medium-light skin tone"
  },
  {
    "code_point": "1F46E 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏽‍♂️",
    "version": "E4.0",
    "description": "man police officer: medium skin tone"
  },
  {
    "code_point": "1F46E 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮🏽‍♂",
    "version": "E4.0",
    "description": "man police officer: medium skin tone"
  },
  {
    "code_point": "1F46E 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏾‍♂️",
    "version": "E4.0",
    "description": "man police officer: medium-dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮🏾‍♂",
    "version": "E4.0",
    "description": "man police officer: medium-dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏿‍♂️",
    "version": "E4.0",
    "description": "man police officer: dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "👮🏿‍♂",
    "version": "E4.0",
    "description": "man police officer: dark skin tone"
  },
  {
    "code_point": "1F46E 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮‍♀️",
    "version": "E4.0",
    "description": "woman police officer"
  },
  {
    "code_point": "1F46E 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮‍♀",
    "version": "E4.0",
    "description": "woman police officer"
  },
  {
    "code_point": "1F46E 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏻‍♀️",
    "version": "E4.0",
    "description": "woman police officer: light skin tone"
  },
  {
    "code_point": "1F46E 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮🏻‍♀",
    "version": "E4.0",
    "description": "woman police officer: light skin tone"
  },
  {
    "code_point": "1F46E 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏼‍♀️",
    "version": "E4.0",
    "description": "woman police officer: medium-light skin tone"
  },
  {
    "code_point": "1F46E 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮🏼‍♀",
    "version": "E4.0",
    "description": "woman police officer: medium-light skin tone"
  },
  {
    "code_point": "1F46E 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏽‍♀️",
    "version": "E4.0",
    "description": "woman police officer: medium skin tone"
  },
  {
    "code_point": "1F46E 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮🏽‍♀",
    "version": "E4.0",
    "description": "woman police officer: medium skin tone"
  },
  {
    "code_point": "1F46E 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏾‍♀️",
    "version": "E4.0",
    "description": "woman police officer: medium-dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮🏾‍♀",
    "version": "E4.0",
    "description": "woman police officer: medium-dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👮🏿‍♀️",
    "version": "E4.0",
    "description": "woman police officer: dark skin tone"
  },
  {
    "code_point": "1F46E 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "👮🏿‍♀",
    "version": "E4.0",
    "description": "woman police officer: dark skin tone"
  },
  {
    "code_point": "1F575 FE0F",
    "status": "fully-qualified",
    "icon": "🕵️",
    "version": "E0.7",
    "description": "detective"
  },
  {
    "code_point": "1F575",
    "status": "unqualified",
    "icon": "🕵",
    "version": "E0.7",
    "description": "detective"
  },
  {
    "code_point": "1F575 1F3FB",
    "status": "fully-qualified",
    "icon": "🕵🏻",
    "version": "E2.0",
    "description": "detective: light skin tone"
  },
  {
    "code_point": "1F575 1F3FC",
    "status": "fully-qualified",
    "icon": "🕵🏼",
    "version": "E2.0",
    "description": "detective: medium-light skin tone"
  },
  {
    "code_point": "1F575 1F3FD",
    "status": "fully-qualified",
    "icon": "🕵🏽",
    "version": "E2.0",
    "description": "detective: medium skin tone"
  },
  {
    "code_point": "1F575 1F3FE",
    "status": "fully-qualified",
    "icon": "🕵🏾",
    "version": "E2.0",
    "description": "detective: medium-dark skin tone"
  },
  {
    "code_point": "1F575 1F3FF",
    "status": "fully-qualified",
    "icon": "🕵🏿",
    "version": "E2.0",
    "description": "detective: dark skin tone"
  },
  {
    "code_point": "1F575 FE0F 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵️‍♂️",
    "version": "E4.0",
    "description": "man detective"
  },
  {
    "code_point": "1F575 200D 2642 FE0F",
    "status": "unqualified",
    "icon": "🕵‍♂️",
    "version": "E4.0",
    "description": "man detective"
  },
  {
    "code_point": "1F575 FE0F 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵️‍♂",
    "version": "E4.0",
    "description": "man detective"
  },
  {
    "code_point": "1F575 200D 2642",
    "status": "unqualified",
    "icon": "🕵‍♂",
    "version": "E4.0",
    "description": "man detective"
  },
  {
    "code_point": "1F575 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏻‍♂️",
    "version": "E4.0",
    "description": "man detective: light skin tone"
  },
  {
    "code_point": "1F575 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵🏻‍♂",
    "version": "E4.0",
    "description": "man detective: light skin tone"
  },
  {
    "code_point": "1F575 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏼‍♂️",
    "version": "E4.0",
    "description": "man detective: medium-light skin tone"
  },
  {
    "code_point": "1F575 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵🏼‍♂",
    "version": "E4.0",
    "description": "man detective: medium-light skin tone"
  },
  {
    "code_point": "1F575 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏽‍♂️",
    "version": "E4.0",
    "description": "man detective: medium skin tone"
  },
  {
    "code_point": "1F575 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵🏽‍♂",
    "version": "E4.0",
    "description": "man detective: medium skin tone"
  },
  {
    "code_point": "1F575 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏾‍♂️",
    "version": "E4.0",
    "description": "man detective: medium-dark skin tone"
  },
  {
    "code_point": "1F575 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵🏾‍♂",
    "version": "E4.0",
    "description": "man detective: medium-dark skin tone"
  },
  {
    "code_point": "1F575 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏿‍♂️",
    "version": "E4.0",
    "description": "man detective: dark skin tone"
  },
  {
    "code_point": "1F575 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🕵🏿‍♂",
    "version": "E4.0",
    "description": "man detective: dark skin tone"
  },
  {
    "code_point": "1F575 FE0F 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵️‍♀️",
    "version": "E4.0",
    "description": "woman detective"
  },
  {
    "code_point": "1F575 200D 2640 FE0F",
    "status": "unqualified",
    "icon": "🕵‍♀️",
    "version": "E4.0",
    "description": "woman detective"
  },
  {
    "code_point": "1F575 FE0F 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵️‍♀",
    "version": "E4.0",
    "description": "woman detective"
  },
  {
    "code_point": "1F575 200D 2640",
    "status": "unqualified",
    "icon": "🕵‍♀",
    "version": "E4.0",
    "description": "woman detective"
  },
  {
    "code_point": "1F575 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏻‍♀️",
    "version": "E4.0",
    "description": "woman detective: light skin tone"
  },
  {
    "code_point": "1F575 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵🏻‍♀",
    "version": "E4.0",
    "description": "woman detective: light skin tone"
  },
  {
    "code_point": "1F575 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏼‍♀️",
    "version": "E4.0",
    "description": "woman detective: medium-light skin tone"
  },
  {
    "code_point": "1F575 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵🏼‍♀",
    "version": "E4.0",
    "description": "woman detective: medium-light skin tone"
  },
  {
    "code_point": "1F575 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏽‍♀️",
    "version": "E4.0",
    "description": "woman detective: medium skin tone"
  },
  {
    "code_point": "1F575 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵🏽‍♀",
    "version": "E4.0",
    "description": "woman detective: medium skin tone"
  },
  {
    "code_point": "1F575 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏾‍♀️",
    "version": "E4.0",
    "description": "woman detective: medium-dark skin tone"
  },
  {
    "code_point": "1F575 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵🏾‍♀",
    "version": "E4.0",
    "description": "woman detective: medium-dark skin tone"
  },
  {
    "code_point": "1F575 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🕵🏿‍♀️",
    "version": "E4.0",
    "description": "woman detective: dark skin tone"
  },
  {
    "code_point": "1F575 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🕵🏿‍♀",
    "version": "E4.0",
    "description": "woman detective: dark skin tone"
  },
  {
    "code_point": "1F482",
    "status": "fully-qualified",
    "icon": "💂",
    "version": "E0.6",
    "description": "guard"
  },
  {
    "code_point": "1F482 1F3FB",
    "status": "fully-qualified",
    "icon": "💂🏻",
    "version": "E1.0",
    "description": "guard: light skin tone"
  },
  {
    "code_point": "1F482 1F3FC",
    "status": "fully-qualified",
    "icon": "💂🏼",
    "version": "E1.0",
    "description": "guard: medium-light skin tone"
  },
  {
    "code_point": "1F482 1F3FD",
    "status": "fully-qualified",
    "icon": "💂🏽",
    "version": "E1.0",
    "description": "guard: medium skin tone"
  },
  {
    "code_point": "1F482 1F3FE",
    "status": "fully-qualified",
    "icon": "💂🏾",
    "version": "E1.0",
    "description": "guard: medium-dark skin tone"
  },
  {
    "code_point": "1F482 1F3FF",
    "status": "fully-qualified",
    "icon": "💂🏿",
    "version": "E1.0",
    "description": "guard: dark skin tone"
  },
  {
    "code_point": "1F482 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂‍♂️",
    "version": "E4.0",
    "description": "man guard"
  },
  {
    "code_point": "1F482 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂‍♂",
    "version": "E4.0",
    "description": "man guard"
  },
  {
    "code_point": "1F482 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏻‍♂️",
    "version": "E4.0",
    "description": "man guard: light skin tone"
  },
  {
    "code_point": "1F482 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂🏻‍♂",
    "version": "E4.0",
    "description": "man guard: light skin tone"
  },
  {
    "code_point": "1F482 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏼‍♂️",
    "version": "E4.0",
    "description": "man guard: medium-light skin tone"
  },
  {
    "code_point": "1F482 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂🏼‍♂",
    "version": "E4.0",
    "description": "man guard: medium-light skin tone"
  },
  {
    "code_point": "1F482 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏽‍♂️",
    "version": "E4.0",
    "description": "man guard: medium skin tone"
  },
  {
    "code_point": "1F482 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂🏽‍♂",
    "version": "E4.0",
    "description": "man guard: medium skin tone"
  },
  {
    "code_point": "1F482 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏾‍♂️",
    "version": "E4.0",
    "description": "man guard: medium-dark skin tone"
  },
  {
    "code_point": "1F482 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂🏾‍♂",
    "version": "E4.0",
    "description": "man guard: medium-dark skin tone"
  },
  {
    "code_point": "1F482 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏿‍♂️",
    "version": "E4.0",
    "description": "man guard: dark skin tone"
  },
  {
    "code_point": "1F482 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "💂🏿‍♂",
    "version": "E4.0",
    "description": "man guard: dark skin tone"
  },
  {
    "code_point": "1F482 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂‍♀️",
    "version": "E4.0",
    "description": "woman guard"
  },
  {
    "code_point": "1F482 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂‍♀",
    "version": "E4.0",
    "description": "woman guard"
  },
  {
    "code_point": "1F482 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏻‍♀️",
    "version": "E4.0",
    "description": "woman guard: light skin tone"
  },
  {
    "code_point": "1F482 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂🏻‍♀",
    "version": "E4.0",
    "description": "woman guard: light skin tone"
  },
  {
    "code_point": "1F482 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏼‍♀️",
    "version": "E4.0",
    "description": "woman guard: medium-light skin tone"
  },
  {
    "code_point": "1F482 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂🏼‍♀",
    "version": "E4.0",
    "description": "woman guard: medium-light skin tone"
  },
  {
    "code_point": "1F482 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏽‍♀️",
    "version": "E4.0",
    "description": "woman guard: medium skin tone"
  },
  {
    "code_point": "1F482 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂🏽‍♀",
    "version": "E4.0",
    "description": "woman guard: medium skin tone"
  },
  {
    "code_point": "1F482 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏾‍♀️",
    "version": "E4.0",
    "description": "woman guard: medium-dark skin tone"
  },
  {
    "code_point": "1F482 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂🏾‍♀",
    "version": "E4.0",
    "description": "woman guard: medium-dark skin tone"
  },
  {
    "code_point": "1F482 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💂🏿‍♀️",
    "version": "E4.0",
    "description": "woman guard: dark skin tone"
  },
  {
    "code_point": "1F482 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "💂🏿‍♀",
    "version": "E4.0",
    "description": "woman guard: dark skin tone"
  },
  {
    "code_point": "1F977",
    "status": "fully-qualified",
    "icon": "🥷",
    "version": "E13.0",
    "description": "ninja"
  },
  {
    "code_point": "1F977 1F3FB",
    "status": "fully-qualified",
    "icon": "🥷🏻",
    "version": "E13.0",
    "description": "ninja: light skin tone"
  },
  {
    "code_point": "1F977 1F3FC",
    "status": "fully-qualified",
    "icon": "🥷🏼",
    "version": "E13.0",
    "description": "ninja: medium-light skin tone"
  },
  {
    "code_point": "1F977 1F3FD",
    "status": "fully-qualified",
    "icon": "🥷🏽",
    "version": "E13.0",
    "description": "ninja: medium skin tone"
  },
  {
    "code_point": "1F977 1F3FE",
    "status": "fully-qualified",
    "icon": "🥷🏾",
    "version": "E13.0",
    "description": "ninja: medium-dark skin tone"
  },
  {
    "code_point": "1F977 1F3FF",
    "status": "fully-qualified",
    "icon": "🥷🏿",
    "version": "E13.0",
    "description": "ninja: dark skin tone"
  },
  {
    "code_point": "1F477",
    "status": "fully-qualified",
    "icon": "👷",
    "version": "E0.6",
    "description": "construction worker"
  },
  {
    "code_point": "1F477 1F3FB",
    "status": "fully-qualified",
    "icon": "👷🏻",
    "version": "E1.0",
    "description": "construction worker: light skin tone"
  },
  {
    "code_point": "1F477 1F3FC",
    "status": "fully-qualified",
    "icon": "👷🏼",
    "version": "E1.0",
    "description": "construction worker: medium-light skin tone"
  },
  {
    "code_point": "1F477 1F3FD",
    "status": "fully-qualified",
    "icon": "👷🏽",
    "version": "E1.0",
    "description": "construction worker: medium skin tone"
  },
  {
    "code_point": "1F477 1F3FE",
    "status": "fully-qualified",
    "icon": "👷🏾",
    "version": "E1.0",
    "description": "construction worker: medium-dark skin tone"
  },
  {
    "code_point": "1F477 1F3FF",
    "status": "fully-qualified",
    "icon": "👷🏿",
    "version": "E1.0",
    "description": "construction worker: dark skin tone"
  },
  {
    "code_point": "1F477 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷‍♂️",
    "version": "E4.0",
    "description": "man construction worker"
  },
  {
    "code_point": "1F477 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷‍♂",
    "version": "E4.0",
    "description": "man construction worker"
  },
  {
    "code_point": "1F477 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏻‍♂️",
    "version": "E4.0",
    "description": "man construction worker: light skin tone"
  },
  {
    "code_point": "1F477 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷🏻‍♂",
    "version": "E4.0",
    "description": "man construction worker: light skin tone"
  },
  {
    "code_point": "1F477 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏼‍♂️",
    "version": "E4.0",
    "description": "man construction worker: medium-light skin tone"
  },
  {
    "code_point": "1F477 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷🏼‍♂",
    "version": "E4.0",
    "description": "man construction worker: medium-light skin tone"
  },
  {
    "code_point": "1F477 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏽‍♂️",
    "version": "E4.0",
    "description": "man construction worker: medium skin tone"
  },
  {
    "code_point": "1F477 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷🏽‍♂",
    "version": "E4.0",
    "description": "man construction worker: medium skin tone"
  },
  {
    "code_point": "1F477 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏾‍♂️",
    "version": "E4.0",
    "description": "man construction worker: medium-dark skin tone"
  },
  {
    "code_point": "1F477 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷🏾‍♂",
    "version": "E4.0",
    "description": "man construction worker: medium-dark skin tone"
  },
  {
    "code_point": "1F477 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏿‍♂️",
    "version": "E4.0",
    "description": "man construction worker: dark skin tone"
  },
  {
    "code_point": "1F477 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "👷🏿‍♂",
    "version": "E4.0",
    "description": "man construction worker: dark skin tone"
  },
  {
    "code_point": "1F477 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷‍♀️",
    "version": "E4.0",
    "description": "woman construction worker"
  },
  {
    "code_point": "1F477 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷‍♀",
    "version": "E4.0",
    "description": "woman construction worker"
  },
  {
    "code_point": "1F477 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏻‍♀️",
    "version": "E4.0",
    "description": "woman construction worker: light skin tone"
  },
  {
    "code_point": "1F477 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷🏻‍♀",
    "version": "E4.0",
    "description": "woman construction worker: light skin tone"
  },
  {
    "code_point": "1F477 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏼‍♀️",
    "version": "E4.0",
    "description": "woman construction worker: medium-light skin tone"
  },
  {
    "code_point": "1F477 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷🏼‍♀",
    "version": "E4.0",
    "description": "woman construction worker: medium-light skin tone"
  },
  {
    "code_point": "1F477 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏽‍♀️",
    "version": "E4.0",
    "description": "woman construction worker: medium skin tone"
  },
  {
    "code_point": "1F477 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷🏽‍♀",
    "version": "E4.0",
    "description": "woman construction worker: medium skin tone"
  },
  {
    "code_point": "1F477 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏾‍♀️",
    "version": "E4.0",
    "description": "woman construction worker: medium-dark skin tone"
  },
  {
    "code_point": "1F477 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷🏾‍♀",
    "version": "E4.0",
    "description": "woman construction worker: medium-dark skin tone"
  },
  {
    "code_point": "1F477 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👷🏿‍♀️",
    "version": "E4.0",
    "description": "woman construction worker: dark skin tone"
  },
  {
    "code_point": "1F477 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "👷🏿‍♀",
    "version": "E4.0",
    "description": "woman construction worker: dark skin tone"
  },
  {
    "code_point": "1FAC5",
    "status": "fully-qualified",
    "icon": "🫅",
    "version": "E14.0",
    "description": "person with crown"
  },
  {
    "code_point": "1FAC5 1F3FB",
    "status": "fully-qualified",
    "icon": "🫅🏻",
    "version": "E14.0",
    "description": "person with crown: light skin tone"
  },
  {
    "code_point": "1FAC5 1F3FC",
    "status": "fully-qualified",
    "icon": "🫅🏼",
    "version": "E14.0",
    "description": "person with crown: medium-light skin tone"
  },
  {
    "code_point": "1FAC5 1F3FD",
    "status": "fully-qualified",
    "icon": "🫅🏽",
    "version": "E14.0",
    "description": "person with crown: medium skin tone"
  },
  {
    "code_point": "1FAC5 1F3FE",
    "status": "fully-qualified",
    "icon": "🫅🏾",
    "version": "E14.0",
    "description": "person with crown: medium-dark skin tone"
  },
  {
    "code_point": "1FAC5 1F3FF",
    "status": "fully-qualified",
    "icon": "🫅🏿",
    "version": "E14.0",
    "description": "person with crown: dark skin tone"
  },
  {
    "code_point": "1F934",
    "status": "fully-qualified",
    "icon": "🤴",
    "version": "E3.0",
    "description": "prince"
  },
  {
    "code_point": "1F934 1F3FB",
    "status": "fully-qualified",
    "icon": "🤴🏻",
    "version": "E3.0",
    "description": "prince: light skin tone"
  },
  {
    "code_point": "1F934 1F3FC",
    "status": "fully-qualified",
    "icon": "🤴🏼",
    "version": "E3.0",
    "description": "prince: medium-light skin tone"
  },
  {
    "code_point": "1F934 1F3FD",
    "status": "fully-qualified",
    "icon": "🤴🏽",
    "version": "E3.0",
    "description": "prince: medium skin tone"
  },
  {
    "code_point": "1F934 1F3FE",
    "status": "fully-qualified",
    "icon": "🤴🏾",
    "version": "E3.0",
    "description": "prince: medium-dark skin tone"
  },
  {
    "code_point": "1F934 1F3FF",
    "status": "fully-qualified",
    "icon": "🤴🏿",
    "version": "E3.0",
    "description": "prince: dark skin tone"
  },
  {
    "code_point": "1F478",
    "status": "fully-qualified",
    "icon": "👸",
    "version": "E0.6",
    "description": "princess"
  },
  {
    "code_point": "1F478 1F3FB",
    "status": "fully-qualified",
    "icon": "👸🏻",
    "version": "E1.0",
    "description": "princess: light skin tone"
  },
  {
    "code_point": "1F478 1F3FC",
    "status": "fully-qualified",
    "icon": "👸🏼",
    "version": "E1.0",
    "description": "princess: medium-light skin tone"
  },
  {
    "code_point": "1F478 1F3FD",
    "status": "fully-qualified",
    "icon": "👸🏽",
    "version": "E1.0",
    "description": "princess: medium skin tone"
  },
  {
    "code_point": "1F478 1F3FE",
    "status": "fully-qualified",
    "icon": "👸🏾",
    "version": "E1.0",
    "description": "princess: medium-dark skin tone"
  },
  {
    "code_point": "1F478 1F3FF",
    "status": "fully-qualified",
    "icon": "👸🏿",
    "version": "E1.0",
    "description": "princess: dark skin tone"
  },
  {
    "code_point": "1F473",
    "status": "fully-qualified",
    "icon": "👳",
    "version": "E0.6",
    "description": "person wearing turban"
  },
  {
    "code_point": "1F473 1F3FB",
    "status": "fully-qualified",
    "icon": "👳🏻",
    "version": "E1.0",
    "description": "person wearing turban: light skin tone"
  },
  {
    "code_point": "1F473 1F3FC",
    "status": "fully-qualified",
    "icon": "👳🏼",
    "version": "E1.0",
    "description": "person wearing turban: medium-light skin tone"
  },
  {
    "code_point": "1F473 1F3FD",
    "status": "fully-qualified",
    "icon": "👳🏽",
    "version": "E1.0",
    "description": "person wearing turban: medium skin tone"
  },
  {
    "code_point": "1F473 1F3FE",
    "status": "fully-qualified",
    "icon": "👳🏾",
    "version": "E1.0",
    "description": "person wearing turban: medium-dark skin tone"
  },
  {
    "code_point": "1F473 1F3FF",
    "status": "fully-qualified",
    "icon": "👳🏿",
    "version": "E1.0",
    "description": "person wearing turban: dark skin tone"
  },
  {
    "code_point": "1F473 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳‍♂️",
    "version": "E4.0",
    "description": "man wearing turban"
  },
  {
    "code_point": "1F473 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳‍♂",
    "version": "E4.0",
    "description": "man wearing turban"
  },
  {
    "code_point": "1F473 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏻‍♂️",
    "version": "E4.0",
    "description": "man wearing turban: light skin tone"
  },
  {
    "code_point": "1F473 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳🏻‍♂",
    "version": "E4.0",
    "description": "man wearing turban: light skin tone"
  },
  {
    "code_point": "1F473 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏼‍♂️",
    "version": "E4.0",
    "description": "man wearing turban: medium-light skin tone"
  },
  {
    "code_point": "1F473 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳🏼‍♂",
    "version": "E4.0",
    "description": "man wearing turban: medium-light skin tone"
  },
  {
    "code_point": "1F473 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏽‍♂️",
    "version": "E4.0",
    "description": "man wearing turban: medium skin tone"
  },
  {
    "code_point": "1F473 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳🏽‍♂",
    "version": "E4.0",
    "description": "man wearing turban: medium skin tone"
  },
  {
    "code_point": "1F473 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏾‍♂️",
    "version": "E4.0",
    "description": "man wearing turban: medium-dark skin tone"
  },
  {
    "code_point": "1F473 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳🏾‍♂",
    "version": "E4.0",
    "description": "man wearing turban: medium-dark skin tone"
  },
  {
    "code_point": "1F473 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏿‍♂️",
    "version": "E4.0",
    "description": "man wearing turban: dark skin tone"
  },
  {
    "code_point": "1F473 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "👳🏿‍♂",
    "version": "E4.0",
    "description": "man wearing turban: dark skin tone"
  },
  {
    "code_point": "1F473 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban"
  },
  {
    "code_point": "1F473 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳‍♀",
    "version": "E4.0",
    "description": "woman wearing turban"
  },
  {
    "code_point": "1F473 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏻‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban: light skin tone"
  },
  {
    "code_point": "1F473 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳🏻‍♀",
    "version": "E4.0",
    "description": "woman wearing turban: light skin tone"
  },
  {
    "code_point": "1F473 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏼‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban: medium-light skin tone"
  },
  {
    "code_point": "1F473 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳🏼‍♀",
    "version": "E4.0",
    "description": "woman wearing turban: medium-light skin tone"
  },
  {
    "code_point": "1F473 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏽‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban: medium skin tone"
  },
  {
    "code_point": "1F473 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳🏽‍♀",
    "version": "E4.0",
    "description": "woman wearing turban: medium skin tone"
  },
  {
    "code_point": "1F473 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏾‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban: medium-dark skin tone"
  },
  {
    "code_point": "1F473 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳🏾‍♀",
    "version": "E4.0",
    "description": "woman wearing turban: medium-dark skin tone"
  },
  {
    "code_point": "1F473 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👳🏿‍♀️",
    "version": "E4.0",
    "description": "woman wearing turban: dark skin tone"
  },
  {
    "code_point": "1F473 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "👳🏿‍♀",
    "version": "E4.0",
    "description": "woman wearing turban: dark skin tone"
  },
  {
    "code_point": "1F472",
    "status": "fully-qualified",
    "icon": "👲",
    "version": "E0.6",
    "description": "person with skullcap"
  },
  {
    "code_point": "1F472 1F3FB",
    "status": "fully-qualified",
    "icon": "👲🏻",
    "version": "E1.0",
    "description": "person with skullcap: light skin tone"
  },
  {
    "code_point": "1F472 1F3FC",
    "status": "fully-qualified",
    "icon": "👲🏼",
    "version": "E1.0",
    "description": "person with skullcap: medium-light skin tone"
  },
  {
    "code_point": "1F472 1F3FD",
    "status": "fully-qualified",
    "icon": "👲🏽",
    "version": "E1.0",
    "description": "person with skullcap: medium skin tone"
  },
  {
    "code_point": "1F472 1F3FE",
    "status": "fully-qualified",
    "icon": "👲🏾",
    "version": "E1.0",
    "description": "person with skullcap: medium-dark skin tone"
  },
  {
    "code_point": "1F472 1F3FF",
    "status": "fully-qualified",
    "icon": "👲🏿",
    "version": "E1.0",
    "description": "person with skullcap: dark skin tone"
  },
  {
    "code_point": "1F9D5",
    "status": "fully-qualified",
    "icon": "🧕",
    "version": "E5.0",
    "description": "woman with headscarf"
  },
  {
    "code_point": "1F9D5 1F3FB",
    "status": "fully-qualified",
    "icon": "🧕🏻",
    "version": "E5.0",
    "description": "woman with headscarf: light skin tone"
  },
  {
    "code_point": "1F9D5 1F3FC",
    "status": "fully-qualified",
    "icon": "🧕🏼",
    "version": "E5.0",
    "description": "woman with headscarf: medium-light skin tone"
  },
  {
    "code_point": "1F9D5 1F3FD",
    "status": "fully-qualified",
    "icon": "🧕🏽",
    "version": "E5.0",
    "description": "woman with headscarf: medium skin tone"
  },
  {
    "code_point": "1F9D5 1F3FE",
    "status": "fully-qualified",
    "icon": "🧕🏾",
    "version": "E5.0",
    "description": "woman with headscarf: medium-dark skin tone"
  },
  {
    "code_point": "1F9D5 1F3FF",
    "status": "fully-qualified",
    "icon": "🧕🏿",
    "version": "E5.0",
    "description": "woman with headscarf: dark skin tone"
  },
  {
    "code_point": "1F935",
    "status": "fully-qualified",
    "icon": "🤵",
    "version": "E3.0",
    "description": "person in tuxedo"
  },
  {
    "code_point": "1F935 1F3FB",
    "status": "fully-qualified",
    "icon": "🤵🏻",
    "version": "E3.0",
    "description": "person in tuxedo: light skin tone"
  },
  {
    "code_point": "1F935 1F3FC",
    "status": "fully-qualified",
    "icon": "🤵🏼",
    "version": "E3.0",
    "description": "person in tuxedo: medium-light skin tone"
  },
  {
    "code_point": "1F935 1F3FD",
    "status": "fully-qualified",
    "icon": "🤵🏽",
    "version": "E3.0",
    "description": "person in tuxedo: medium skin tone"
  },
  {
    "code_point": "1F935 1F3FE",
    "status": "fully-qualified",
    "icon": "🤵🏾",
    "version": "E3.0",
    "description": "person in tuxedo: medium-dark skin tone"
  },
  {
    "code_point": "1F935 1F3FF",
    "status": "fully-qualified",
    "icon": "🤵🏿",
    "version": "E3.0",
    "description": "person in tuxedo: dark skin tone"
  },
  {
    "code_point": "1F935 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo"
  },
  {
    "code_point": "1F935 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵‍♂",
    "version": "E13.0",
    "description": "man in tuxedo"
  },
  {
    "code_point": "1F935 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏻‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo: light skin tone"
  },
  {
    "code_point": "1F935 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵🏻‍♂",
    "version": "E13.0",
    "description": "man in tuxedo: light skin tone"
  },
  {
    "code_point": "1F935 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏼‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo: medium-light skin tone"
  },
  {
    "code_point": "1F935 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵🏼‍♂",
    "version": "E13.0",
    "description": "man in tuxedo: medium-light skin tone"
  },
  {
    "code_point": "1F935 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏽‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo: medium skin tone"
  },
  {
    "code_point": "1F935 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵🏽‍♂",
    "version": "E13.0",
    "description": "man in tuxedo: medium skin tone"
  },
  {
    "code_point": "1F935 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏾‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo: medium-dark skin tone"
  },
  {
    "code_point": "1F935 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵🏾‍♂",
    "version": "E13.0",
    "description": "man in tuxedo: medium-dark skin tone"
  },
  {
    "code_point": "1F935 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏿‍♂️",
    "version": "E13.0",
    "description": "man in tuxedo: dark skin tone"
  },
  {
    "code_point": "1F935 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤵🏿‍♂",
    "version": "E13.0",
    "description": "man in tuxedo: dark skin tone"
  },
  {
    "code_point": "1F935 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo"
  },
  {
    "code_point": "1F935 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo"
  },
  {
    "code_point": "1F935 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏻‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo: light skin tone"
  },
  {
    "code_point": "1F935 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵🏻‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo: light skin tone"
  },
  {
    "code_point": "1F935 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏼‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo: medium-light skin tone"
  },
  {
    "code_point": "1F935 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵🏼‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo: medium-light skin tone"
  },
  {
    "code_point": "1F935 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏽‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo: medium skin tone"
  },
  {
    "code_point": "1F935 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵🏽‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo: medium skin tone"
  },
  {
    "code_point": "1F935 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏾‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo: medium-dark skin tone"
  },
  {
    "code_point": "1F935 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵🏾‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo: medium-dark skin tone"
  },
  {
    "code_point": "1F935 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤵🏿‍♀️",
    "version": "E13.0",
    "description": "woman in tuxedo: dark skin tone"
  },
  {
    "code_point": "1F935 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤵🏿‍♀",
    "version": "E13.0",
    "description": "woman in tuxedo: dark skin tone"
  },
  {
    "code_point": "1F470",
    "status": "fully-qualified",
    "icon": "👰",
    "version": "E0.6",
    "description": "person with veil"
  },
  {
    "code_point": "1F470 1F3FB",
    "status": "fully-qualified",
    "icon": "👰🏻",
    "version": "E1.0",
    "description": "person with veil: light skin tone"
  },
  {
    "code_point": "1F470 1F3FC",
    "status": "fully-qualified",
    "icon": "👰🏼",
    "version": "E1.0",
    "description": "person with veil: medium-light skin tone"
  },
  {
    "code_point": "1F470 1F3FD",
    "status": "fully-qualified",
    "icon": "👰🏽",
    "version": "E1.0",
    "description": "person with veil: medium skin tone"
  },
  {
    "code_point": "1F470 1F3FE",
    "status": "fully-qualified",
    "icon": "👰🏾",
    "version": "E1.0",
    "description": "person with veil: medium-dark skin tone"
  },
  {
    "code_point": "1F470 1F3FF",
    "status": "fully-qualified",
    "icon": "👰🏿",
    "version": "E1.0",
    "description": "person with veil: dark skin tone"
  },
  {
    "code_point": "1F470 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰‍♂️",
    "version": "E13.0",
    "description": "man with veil"
  },
  {
    "code_point": "1F470 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰‍♂",
    "version": "E13.0",
    "description": "man with veil"
  },
  {
    "code_point": "1F470 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏻‍♂️",
    "version": "E13.0",
    "description": "man with veil: light skin tone"
  },
  {
    "code_point": "1F470 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰🏻‍♂",
    "version": "E13.0",
    "description": "man with veil: light skin tone"
  },
  {
    "code_point": "1F470 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏼‍♂️",
    "version": "E13.0",
    "description": "man with veil: medium-light skin tone"
  },
  {
    "code_point": "1F470 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰🏼‍♂",
    "version": "E13.0",
    "description": "man with veil: medium-light skin tone"
  },
  {
    "code_point": "1F470 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏽‍♂️",
    "version": "E13.0",
    "description": "man with veil: medium skin tone"
  },
  {
    "code_point": "1F470 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰🏽‍♂",
    "version": "E13.0",
    "description": "man with veil: medium skin tone"
  },
  {
    "code_point": "1F470 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏾‍♂️",
    "version": "E13.0",
    "description": "man with veil: medium-dark skin tone"
  },
  {
    "code_point": "1F470 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰🏾‍♂",
    "version": "E13.0",
    "description": "man with veil: medium-dark skin tone"
  },
  {
    "code_point": "1F470 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏿‍♂️",
    "version": "E13.0",
    "description": "man with veil: dark skin tone"
  },
  {
    "code_point": "1F470 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "👰🏿‍♂",
    "version": "E13.0",
    "description": "man with veil: dark skin tone"
  },
  {
    "code_point": "1F470 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰‍♀️",
    "version": "E13.0",
    "description": "woman with veil"
  },
  {
    "code_point": "1F470 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰‍♀",
    "version": "E13.0",
    "description": "woman with veil"
  },
  {
    "code_point": "1F470 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏻‍♀️",
    "version": "E13.0",
    "description": "woman with veil: light skin tone"
  },
  {
    "code_point": "1F470 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰🏻‍♀",
    "version": "E13.0",
    "description": "woman with veil: light skin tone"
  },
  {
    "code_point": "1F470 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏼‍♀️",
    "version": "E13.0",
    "description": "woman with veil: medium-light skin tone"
  },
  {
    "code_point": "1F470 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰🏼‍♀",
    "version": "E13.0",
    "description": "woman with veil: medium-light skin tone"
  },
  {
    "code_point": "1F470 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏽‍♀️",
    "version": "E13.0",
    "description": "woman with veil: medium skin tone"
  },
  {
    "code_point": "1F470 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰🏽‍♀",
    "version": "E13.0",
    "description": "woman with veil: medium skin tone"
  },
  {
    "code_point": "1F470 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏾‍♀️",
    "version": "E13.0",
    "description": "woman with veil: medium-dark skin tone"
  },
  {
    "code_point": "1F470 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰🏾‍♀",
    "version": "E13.0",
    "description": "woman with veil: medium-dark skin tone"
  },
  {
    "code_point": "1F470 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👰🏿‍♀️",
    "version": "E13.0",
    "description": "woman with veil: dark skin tone"
  },
  {
    "code_point": "1F470 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "👰🏿‍♀",
    "version": "E13.0",
    "description": "woman with veil: dark skin tone"
  },
  {
    "code_point": "1F930",
    "status": "fully-qualified",
    "icon": "🤰",
    "version": "E3.0",
    "description": "pregnant woman"
  },
  {
    "code_point": "1F930 1F3FB",
    "status": "fully-qualified",
    "icon": "🤰🏻",
    "version": "E3.0",
    "description": "pregnant woman: light skin tone"
  },
  {
    "code_point": "1F930 1F3FC",
    "status": "fully-qualified",
    "icon": "🤰🏼",
    "version": "E3.0",
    "description": "pregnant woman: medium-light skin tone"
  },
  {
    "code_point": "1F930 1F3FD",
    "status": "fully-qualified",
    "icon": "🤰🏽",
    "version": "E3.0",
    "description": "pregnant woman: medium skin tone"
  },
  {
    "code_point": "1F930 1F3FE",
    "status": "fully-qualified",
    "icon": "🤰🏾",
    "version": "E3.0",
    "description": "pregnant woman: medium-dark skin tone"
  },
  {
    "code_point": "1F930 1F3FF",
    "status": "fully-qualified",
    "icon": "🤰🏿",
    "version": "E3.0",
    "description": "pregnant woman: dark skin tone"
  },
  {
    "code_point": "1FAC3",
    "status": "fully-qualified",
    "icon": "🫃",
    "version": "E14.0",
    "description": "pregnant man"
  },
  {
    "code_point": "1FAC3 1F3FB",
    "status": "fully-qualified",
    "icon": "🫃🏻",
    "version": "E14.0",
    "description": "pregnant man: light skin tone"
  },
  {
    "code_point": "1FAC3 1F3FC",
    "status": "fully-qualified",
    "icon": "🫃🏼",
    "version": "E14.0",
    "description": "pregnant man: medium-light skin tone"
  },
  {
    "code_point": "1FAC3 1F3FD",
    "status": "fully-qualified",
    "icon": "🫃🏽",
    "version": "E14.0",
    "description": "pregnant man: medium skin tone"
  },
  {
    "code_point": "1FAC3 1F3FE",
    "status": "fully-qualified",
    "icon": "🫃🏾",
    "version": "E14.0",
    "description": "pregnant man: medium-dark skin tone"
  },
  {
    "code_point": "1FAC3 1F3FF",
    "status": "fully-qualified",
    "icon": "🫃🏿",
    "version": "E14.0",
    "description": "pregnant man: dark skin tone"
  },
  {
    "code_point": "1FAC4",
    "status": "fully-qualified",
    "icon": "🫄",
    "version": "E14.0",
    "description": "pregnant person"
  },
  {
    "code_point": "1FAC4 1F3FB",
    "status": "fully-qualified",
    "icon": "🫄🏻",
    "version": "E14.0",
    "description": "pregnant person: light skin tone"
  },
  {
    "code_point": "1FAC4 1F3FC",
    "status": "fully-qualified",
    "icon": "🫄🏼",
    "version": "E14.0",
    "description": "pregnant person: medium-light skin tone"
  },
  {
    "code_point": "1FAC4 1F3FD",
    "status": "fully-qualified",
    "icon": "🫄🏽",
    "version": "E14.0",
    "description": "pregnant person: medium skin tone"
  },
  {
    "code_point": "1FAC4 1F3FE",
    "status": "fully-qualified",
    "icon": "🫄🏾",
    "version": "E14.0",
    "description": "pregnant person: medium-dark skin tone"
  },
  {
    "code_point": "1FAC4 1F3FF",
    "status": "fully-qualified",
    "icon": "🫄🏿",
    "version": "E14.0",
    "description": "pregnant person: dark skin tone"
  },
  {
    "code_point": "1F931",
    "status": "fully-qualified",
    "icon": "🤱",
    "version": "E5.0",
    "description": "breast-feeding"
  },
  {
    "code_point": "1F931 1F3FB",
    "status": "fully-qualified",
    "icon": "🤱🏻",
    "version": "E5.0",
    "description": "breast-feeding: light skin tone"
  },
  {
    "code_point": "1F931 1F3FC",
    "status": "fully-qualified",
    "icon": "🤱🏼",
    "version": "E5.0",
    "description": "breast-feeding: medium-light skin tone"
  },
  {
    "code_point": "1F931 1F3FD",
    "status": "fully-qualified",
    "icon": "🤱🏽",
    "version": "E5.0",
    "description": "breast-feeding: medium skin tone"
  },
  {
    "code_point": "1F931 1F3FE",
    "status": "fully-qualified",
    "icon": "🤱🏾",
    "version": "E5.0",
    "description": "breast-feeding: medium-dark skin tone"
  },
  {
    "code_point": "1F931 1F3FF",
    "status": "fully-qualified",
    "icon": "🤱🏿",
    "version": "E5.0",
    "description": "breast-feeding: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩🏻‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩🏼‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩🏽‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩🏾‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👩🏿‍🍼",
    "version": "E13.0",
    "description": "woman feeding baby: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨‍🍼",
    "version": "E13.0",
    "description": "man feeding baby"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨🏻‍🍼",
    "version": "E13.0",
    "description": "man feeding baby: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨🏼‍🍼",
    "version": "E13.0",
    "description": "man feeding baby: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨🏽‍🍼",
    "version": "E13.0",
    "description": "man feeding baby: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨🏾‍🍼",
    "version": "E13.0",
    "description": "man feeding baby: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F37C",
    "status": "fully-qualified",
    "icon": "👨🏿‍🍼",
    "version": "E13.0",
    "description": "man feeding baby: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑‍🍼",
    "version": "E13.0",
    "description": "person feeding baby"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🍼",
    "version": "E13.0",
    "description": "person feeding baby: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🍼",
    "version": "E13.0",
    "description": "person feeding baby: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🍼",
    "version": "E13.0",
    "description": "person feeding baby: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🍼",
    "version": "E13.0",
    "description": "person feeding baby: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F37C",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🍼",
    "version": "E13.0",
    "description": "person feeding baby: dark skin tone"
  },
  {
    "code_point": "1F47C",
    "status": "fully-qualified",
    "icon": "👼",
    "version": "E0.6",
    "description": "baby angel"
  },
  {
    "code_point": "1F47C 1F3FB",
    "status": "fully-qualified",
    "icon": "👼🏻",
    "version": "E1.0",
    "description": "baby angel: light skin tone"
  },
  {
    "code_point": "1F47C 1F3FC",
    "status": "fully-qualified",
    "icon": "👼🏼",
    "version": "E1.0",
    "description": "baby angel: medium-light skin tone"
  },
  {
    "code_point": "1F47C 1F3FD",
    "status": "fully-qualified",
    "icon": "👼🏽",
    "version": "E1.0",
    "description": "baby angel: medium skin tone"
  },
  {
    "code_point": "1F47C 1F3FE",
    "status": "fully-qualified",
    "icon": "👼🏾",
    "version": "E1.0",
    "description": "baby angel: medium-dark skin tone"
  },
  {
    "code_point": "1F47C 1F3FF",
    "status": "fully-qualified",
    "icon": "👼🏿",
    "version": "E1.0",
    "description": "baby angel: dark skin tone"
  },
  {
    "code_point": "1F385",
    "status": "fully-qualified",
    "icon": "🎅",
    "version": "E0.6",
    "description": "Santa Claus"
  },
  {
    "code_point": "1F385 1F3FB",
    "status": "fully-qualified",
    "icon": "🎅🏻",
    "version": "E1.0",
    "description": "Santa Claus: light skin tone"
  },
  {
    "code_point": "1F385 1F3FC",
    "status": "fully-qualified",
    "icon": "🎅🏼",
    "version": "E1.0",
    "description": "Santa Claus: medium-light skin tone"
  },
  {
    "code_point": "1F385 1F3FD",
    "status": "fully-qualified",
    "icon": "🎅🏽",
    "version": "E1.0",
    "description": "Santa Claus: medium skin tone"
  },
  {
    "code_point": "1F385 1F3FE",
    "status": "fully-qualified",
    "icon": "🎅🏾",
    "version": "E1.0",
    "description": "Santa Claus: medium-dark skin tone"
  },
  {
    "code_point": "1F385 1F3FF",
    "status": "fully-qualified",
    "icon": "🎅🏿",
    "version": "E1.0",
    "description": "Santa Claus: dark skin tone"
  },
  {
    "code_point": "1F936",
    "status": "fully-qualified",
    "icon": "🤶",
    "version": "E3.0",
    "description": "Mrs. Claus"
  },
  {
    "code_point": "1F936 1F3FB",
    "status": "fully-qualified",
    "icon": "🤶🏻",
    "version": "E3.0",
    "description": "Mrs. Claus: light skin tone"
  },
  {
    "code_point": "1F936 1F3FC",
    "status": "fully-qualified",
    "icon": "🤶🏼",
    "version": "E3.0",
    "description": "Mrs. Claus: medium-light skin tone"
  },
  {
    "code_point": "1F936 1F3FD",
    "status": "fully-qualified",
    "icon": "🤶🏽",
    "version": "E3.0",
    "description": "Mrs. Claus: medium skin tone"
  },
  {
    "code_point": "1F936 1F3FE",
    "status": "fully-qualified",
    "icon": "🤶🏾",
    "version": "E3.0",
    "description": "Mrs. Claus: medium-dark skin tone"
  },
  {
    "code_point": "1F936 1F3FF",
    "status": "fully-qualified",
    "icon": "🤶🏿",
    "version": "E3.0",
    "description": "Mrs. Claus: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑‍🎄",
    "version": "E13.0",
    "description": "Mx Claus"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🎄",
    "version": "E13.0",
    "description": "Mx Claus: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🎄",
    "version": "E13.0",
    "description": "Mx Claus: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🎄",
    "version": "E13.0",
    "description": "Mx Claus: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🎄",
    "version": "E13.0",
    "description": "Mx Claus: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F384",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🎄",
    "version": "E13.0",
    "description": "Mx Claus: dark skin tone"
  },
  {
    "code_point": "1F9B8",
    "status": "fully-qualified",
    "icon": "🦸",
    "version": "E11.0",
    "description": "superhero"
  },
  {
    "code_point": "1F9B8 1F3FB",
    "status": "fully-qualified",
    "icon": "🦸🏻",
    "version": "E11.0",
    "description": "superhero: light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FC",
    "status": "fully-qualified",
    "icon": "🦸🏼",
    "version": "E11.0",
    "description": "superhero: medium-light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FD",
    "status": "fully-qualified",
    "icon": "🦸🏽",
    "version": "E11.0",
    "description": "superhero: medium skin tone"
  },
  {
    "code_point": "1F9B8 1F3FE",
    "status": "fully-qualified",
    "icon": "🦸🏾",
    "version": "E11.0",
    "description": "superhero: medium-dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FF",
    "status": "fully-qualified",
    "icon": "🦸🏿",
    "version": "E11.0",
    "description": "superhero: dark skin tone"
  },
  {
    "code_point": "1F9B8 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸‍♂️",
    "version": "E11.0",
    "description": "man superhero"
  },
  {
    "code_point": "1F9B8 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸‍♂",
    "version": "E11.0",
    "description": "man superhero"
  },
  {
    "code_point": "1F9B8 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏻‍♂️",
    "version": "E11.0",
    "description": "man superhero: light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸🏻‍♂",
    "version": "E11.0",
    "description": "man superhero: light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏼‍♂️",
    "version": "E11.0",
    "description": "man superhero: medium-light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸🏼‍♂",
    "version": "E11.0",
    "description": "man superhero: medium-light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏽‍♂️",
    "version": "E11.0",
    "description": "man superhero: medium skin tone"
  },
  {
    "code_point": "1F9B8 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸🏽‍♂",
    "version": "E11.0",
    "description": "man superhero: medium skin tone"
  },
  {
    "code_point": "1F9B8 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏾‍♂️",
    "version": "E11.0",
    "description": "man superhero: medium-dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸🏾‍♂",
    "version": "E11.0",
    "description": "man superhero: medium-dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏿‍♂️",
    "version": "E11.0",
    "description": "man superhero: dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦸🏿‍♂",
    "version": "E11.0",
    "description": "man superhero: dark skin tone"
  },
  {
    "code_point": "1F9B8 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸‍♀️",
    "version": "E11.0",
    "description": "woman superhero"
  },
  {
    "code_point": "1F9B8 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸‍♀",
    "version": "E11.0",
    "description": "woman superhero"
  },
  {
    "code_point": "1F9B8 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏻‍♀️",
    "version": "E11.0",
    "description": "woman superhero: light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸🏻‍♀",
    "version": "E11.0",
    "description": "woman superhero: light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏼‍♀️",
    "version": "E11.0",
    "description": "woman superhero: medium-light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸🏼‍♀",
    "version": "E11.0",
    "description": "woman superhero: medium-light skin tone"
  },
  {
    "code_point": "1F9B8 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏽‍♀️",
    "version": "E11.0",
    "description": "woman superhero: medium skin tone"
  },
  {
    "code_point": "1F9B8 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸🏽‍♀",
    "version": "E11.0",
    "description": "woman superhero: medium skin tone"
  },
  {
    "code_point": "1F9B8 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏾‍♀️",
    "version": "E11.0",
    "description": "woman superhero: medium-dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸🏾‍♀",
    "version": "E11.0",
    "description": "woman superhero: medium-dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦸🏿‍♀️",
    "version": "E11.0",
    "description": "woman superhero: dark skin tone"
  },
  {
    "code_point": "1F9B8 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦸🏿‍♀",
    "version": "E11.0",
    "description": "woman superhero: dark skin tone"
  },
  {
    "code_point": "1F9B9",
    "status": "fully-qualified",
    "icon": "🦹",
    "version": "E11.0",
    "description": "supervillain"
  },
  {
    "code_point": "1F9B9 1F3FB",
    "status": "fully-qualified",
    "icon": "🦹🏻",
    "version": "E11.0",
    "description": "supervillain: light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FC",
    "status": "fully-qualified",
    "icon": "🦹🏼",
    "version": "E11.0",
    "description": "supervillain: medium-light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FD",
    "status": "fully-qualified",
    "icon": "🦹🏽",
    "version": "E11.0",
    "description": "supervillain: medium skin tone"
  },
  {
    "code_point": "1F9B9 1F3FE",
    "status": "fully-qualified",
    "icon": "🦹🏾",
    "version": "E11.0",
    "description": "supervillain: medium-dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FF",
    "status": "fully-qualified",
    "icon": "🦹🏿",
    "version": "E11.0",
    "description": "supervillain: dark skin tone"
  },
  {
    "code_point": "1F9B9 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹‍♂️",
    "version": "E11.0",
    "description": "man supervillain"
  },
  {
    "code_point": "1F9B9 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹‍♂",
    "version": "E11.0",
    "description": "man supervillain"
  },
  {
    "code_point": "1F9B9 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏻‍♂️",
    "version": "E11.0",
    "description": "man supervillain: light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹🏻‍♂",
    "version": "E11.0",
    "description": "man supervillain: light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏼‍♂️",
    "version": "E11.0",
    "description": "man supervillain: medium-light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹🏼‍♂",
    "version": "E11.0",
    "description": "man supervillain: medium-light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏽‍♂️",
    "version": "E11.0",
    "description": "man supervillain: medium skin tone"
  },
  {
    "code_point": "1F9B9 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹🏽‍♂",
    "version": "E11.0",
    "description": "man supervillain: medium skin tone"
  },
  {
    "code_point": "1F9B9 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏾‍♂️",
    "version": "E11.0",
    "description": "man supervillain: medium-dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹🏾‍♂",
    "version": "E11.0",
    "description": "man supervillain: medium-dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏿‍♂️",
    "version": "E11.0",
    "description": "man supervillain: dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🦹🏿‍♂",
    "version": "E11.0",
    "description": "man supervillain: dark skin tone"
  },
  {
    "code_point": "1F9B9 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹‍♀️",
    "version": "E11.0",
    "description": "woman supervillain"
  },
  {
    "code_point": "1F9B9 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹‍♀",
    "version": "E11.0",
    "description": "woman supervillain"
  },
  {
    "code_point": "1F9B9 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏻‍♀️",
    "version": "E11.0",
    "description": "woman supervillain: light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹🏻‍♀",
    "version": "E11.0",
    "description": "woman supervillain: light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏼‍♀️",
    "version": "E11.0",
    "description": "woman supervillain: medium-light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹🏼‍♀",
    "version": "E11.0",
    "description": "woman supervillain: medium-light skin tone"
  },
  {
    "code_point": "1F9B9 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏽‍♀️",
    "version": "E11.0",
    "description": "woman supervillain: medium skin tone"
  },
  {
    "code_point": "1F9B9 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹🏽‍♀",
    "version": "E11.0",
    "description": "woman supervillain: medium skin tone"
  },
  {
    "code_point": "1F9B9 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏾‍♀️",
    "version": "E11.0",
    "description": "woman supervillain: medium-dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹🏾‍♀",
    "version": "E11.0",
    "description": "woman supervillain: medium-dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🦹🏿‍♀️",
    "version": "E11.0",
    "description": "woman supervillain: dark skin tone"
  },
  {
    "code_point": "1F9B9 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🦹🏿‍♀",
    "version": "E11.0",
    "description": "woman supervillain: dark skin tone"
  },
  {
    "code_point": "1F9D9",
    "status": "fully-qualified",
    "icon": "🧙",
    "version": "E5.0",
    "description": "mage"
  },
  {
    "code_point": "1F9D9 1F3FB",
    "status": "fully-qualified",
    "icon": "🧙🏻",
    "version": "E5.0",
    "description": "mage: light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FC",
    "status": "fully-qualified",
    "icon": "🧙🏼",
    "version": "E5.0",
    "description": "mage: medium-light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FD",
    "status": "fully-qualified",
    "icon": "🧙🏽",
    "version": "E5.0",
    "description": "mage: medium skin tone"
  },
  {
    "code_point": "1F9D9 1F3FE",
    "status": "fully-qualified",
    "icon": "🧙🏾",
    "version": "E5.0",
    "description": "mage: medium-dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FF",
    "status": "fully-qualified",
    "icon": "🧙🏿",
    "version": "E5.0",
    "description": "mage: dark skin tone"
  },
  {
    "code_point": "1F9D9 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙‍♂️",
    "version": "E5.0",
    "description": "man mage"
  },
  {
    "code_point": "1F9D9 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙‍♂",
    "version": "E5.0",
    "description": "man mage"
  },
  {
    "code_point": "1F9D9 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏻‍♂️",
    "version": "E5.0",
    "description": "man mage: light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙🏻‍♂",
    "version": "E5.0",
    "description": "man mage: light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏼‍♂️",
    "version": "E5.0",
    "description": "man mage: medium-light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙🏼‍♂",
    "version": "E5.0",
    "description": "man mage: medium-light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏽‍♂️",
    "version": "E5.0",
    "description": "man mage: medium skin tone"
  },
  {
    "code_point": "1F9D9 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙🏽‍♂",
    "version": "E5.0",
    "description": "man mage: medium skin tone"
  },
  {
    "code_point": "1F9D9 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏾‍♂️",
    "version": "E5.0",
    "description": "man mage: medium-dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙🏾‍♂",
    "version": "E5.0",
    "description": "man mage: medium-dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏿‍♂️",
    "version": "E5.0",
    "description": "man mage: dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧙🏿‍♂",
    "version": "E5.0",
    "description": "man mage: dark skin tone"
  },
  {
    "code_point": "1F9D9 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙‍♀️",
    "version": "E5.0",
    "description": "woman mage"
  },
  {
    "code_point": "1F9D9 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙‍♀",
    "version": "E5.0",
    "description": "woman mage"
  },
  {
    "code_point": "1F9D9 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏻‍♀️",
    "version": "E5.0",
    "description": "woman mage: light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙🏻‍♀",
    "version": "E5.0",
    "description": "woman mage: light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏼‍♀️",
    "version": "E5.0",
    "description": "woman mage: medium-light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙🏼‍♀",
    "version": "E5.0",
    "description": "woman mage: medium-light skin tone"
  },
  {
    "code_point": "1F9D9 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏽‍♀️",
    "version": "E5.0",
    "description": "woman mage: medium skin tone"
  },
  {
    "code_point": "1F9D9 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙🏽‍♀",
    "version": "E5.0",
    "description": "woman mage: medium skin tone"
  },
  {
    "code_point": "1F9D9 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏾‍♀️",
    "version": "E5.0",
    "description": "woman mage: medium-dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙🏾‍♀",
    "version": "E5.0",
    "description": "woman mage: medium-dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧙🏿‍♀️",
    "version": "E5.0",
    "description": "woman mage: dark skin tone"
  },
  {
    "code_point": "1F9D9 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧙🏿‍♀",
    "version": "E5.0",
    "description": "woman mage: dark skin tone"
  },
  {
    "code_point": "1F9DA",
    "status": "fully-qualified",
    "icon": "🧚",
    "version": "E5.0",
    "description": "fairy"
  },
  {
    "code_point": "1F9DA 1F3FB",
    "status": "fully-qualified",
    "icon": "🧚🏻",
    "version": "E5.0",
    "description": "fairy: light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FC",
    "status": "fully-qualified",
    "icon": "🧚🏼",
    "version": "E5.0",
    "description": "fairy: medium-light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FD",
    "status": "fully-qualified",
    "icon": "🧚🏽",
    "version": "E5.0",
    "description": "fairy: medium skin tone"
  },
  {
    "code_point": "1F9DA 1F3FE",
    "status": "fully-qualified",
    "icon": "🧚🏾",
    "version": "E5.0",
    "description": "fairy: medium-dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FF",
    "status": "fully-qualified",
    "icon": "🧚🏿",
    "version": "E5.0",
    "description": "fairy: dark skin tone"
  },
  {
    "code_point": "1F9DA 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚‍♂️",
    "version": "E5.0",
    "description": "man fairy"
  },
  {
    "code_point": "1F9DA 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚‍♂",
    "version": "E5.0",
    "description": "man fairy"
  },
  {
    "code_point": "1F9DA 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏻‍♂️",
    "version": "E5.0",
    "description": "man fairy: light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚🏻‍♂",
    "version": "E5.0",
    "description": "man fairy: light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏼‍♂️",
    "version": "E5.0",
    "description": "man fairy: medium-light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚🏼‍♂",
    "version": "E5.0",
    "description": "man fairy: medium-light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏽‍♂️",
    "version": "E5.0",
    "description": "man fairy: medium skin tone"
  },
  {
    "code_point": "1F9DA 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚🏽‍♂",
    "version": "E5.0",
    "description": "man fairy: medium skin tone"
  },
  {
    "code_point": "1F9DA 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏾‍♂️",
    "version": "E5.0",
    "description": "man fairy: medium-dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚🏾‍♂",
    "version": "E5.0",
    "description": "man fairy: medium-dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏿‍♂️",
    "version": "E5.0",
    "description": "man fairy: dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧚🏿‍♂",
    "version": "E5.0",
    "description": "man fairy: dark skin tone"
  },
  {
    "code_point": "1F9DA 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚‍♀️",
    "version": "E5.0",
    "description": "woman fairy"
  },
  {
    "code_point": "1F9DA 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚‍♀",
    "version": "E5.0",
    "description": "woman fairy"
  },
  {
    "code_point": "1F9DA 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏻‍♀️",
    "version": "E5.0",
    "description": "woman fairy: light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚🏻‍♀",
    "version": "E5.0",
    "description": "woman fairy: light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏼‍♀️",
    "version": "E5.0",
    "description": "woman fairy: medium-light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚🏼‍♀",
    "version": "E5.0",
    "description": "woman fairy: medium-light skin tone"
  },
  {
    "code_point": "1F9DA 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏽‍♀️",
    "version": "E5.0",
    "description": "woman fairy: medium skin tone"
  },
  {
    "code_point": "1F9DA 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚🏽‍♀",
    "version": "E5.0",
    "description": "woman fairy: medium skin tone"
  },
  {
    "code_point": "1F9DA 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏾‍♀️",
    "version": "E5.0",
    "description": "woman fairy: medium-dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚🏾‍♀",
    "version": "E5.0",
    "description": "woman fairy: medium-dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧚🏿‍♀️",
    "version": "E5.0",
    "description": "woman fairy: dark skin tone"
  },
  {
    "code_point": "1F9DA 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧚🏿‍♀",
    "version": "E5.0",
    "description": "woman fairy: dark skin tone"
  },
  {
    "code_point": "1F9DB",
    "status": "fully-qualified",
    "icon": "🧛",
    "version": "E5.0",
    "description": "vampire"
  },
  {
    "code_point": "1F9DB 1F3FB",
    "status": "fully-qualified",
    "icon": "🧛🏻",
    "version": "E5.0",
    "description": "vampire: light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FC",
    "status": "fully-qualified",
    "icon": "🧛🏼",
    "version": "E5.0",
    "description": "vampire: medium-light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FD",
    "status": "fully-qualified",
    "icon": "🧛🏽",
    "version": "E5.0",
    "description": "vampire: medium skin tone"
  },
  {
    "code_point": "1F9DB 1F3FE",
    "status": "fully-qualified",
    "icon": "🧛🏾",
    "version": "E5.0",
    "description": "vampire: medium-dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FF",
    "status": "fully-qualified",
    "icon": "🧛🏿",
    "version": "E5.0",
    "description": "vampire: dark skin tone"
  },
  {
    "code_point": "1F9DB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛‍♂️",
    "version": "E5.0",
    "description": "man vampire"
  },
  {
    "code_point": "1F9DB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛‍♂",
    "version": "E5.0",
    "description": "man vampire"
  },
  {
    "code_point": "1F9DB 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏻‍♂️",
    "version": "E5.0",
    "description": "man vampire: light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛🏻‍♂",
    "version": "E5.0",
    "description": "man vampire: light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏼‍♂️",
    "version": "E5.0",
    "description": "man vampire: medium-light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛🏼‍♂",
    "version": "E5.0",
    "description": "man vampire: medium-light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏽‍♂️",
    "version": "E5.0",
    "description": "man vampire: medium skin tone"
  },
  {
    "code_point": "1F9DB 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛🏽‍♂",
    "version": "E5.0",
    "description": "man vampire: medium skin tone"
  },
  {
    "code_point": "1F9DB 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏾‍♂️",
    "version": "E5.0",
    "description": "man vampire: medium-dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛🏾‍♂",
    "version": "E5.0",
    "description": "man vampire: medium-dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏿‍♂️",
    "version": "E5.0",
    "description": "man vampire: dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧛🏿‍♂",
    "version": "E5.0",
    "description": "man vampire: dark skin tone"
  },
  {
    "code_point": "1F9DB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛‍♀️",
    "version": "E5.0",
    "description": "woman vampire"
  },
  {
    "code_point": "1F9DB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛‍♀",
    "version": "E5.0",
    "description": "woman vampire"
  },
  {
    "code_point": "1F9DB 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏻‍♀️",
    "version": "E5.0",
    "description": "woman vampire: light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛🏻‍♀",
    "version": "E5.0",
    "description": "woman vampire: light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏼‍♀️",
    "version": "E5.0",
    "description": "woman vampire: medium-light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛🏼‍♀",
    "version": "E5.0",
    "description": "woman vampire: medium-light skin tone"
  },
  {
    "code_point": "1F9DB 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏽‍♀️",
    "version": "E5.0",
    "description": "woman vampire: medium skin tone"
  },
  {
    "code_point": "1F9DB 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛🏽‍♀",
    "version": "E5.0",
    "description": "woman vampire: medium skin tone"
  },
  {
    "code_point": "1F9DB 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏾‍♀️",
    "version": "E5.0",
    "description": "woman vampire: medium-dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛🏾‍♀",
    "version": "E5.0",
    "description": "woman vampire: medium-dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧛🏿‍♀️",
    "version": "E5.0",
    "description": "woman vampire: dark skin tone"
  },
  {
    "code_point": "1F9DB 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧛🏿‍♀",
    "version": "E5.0",
    "description": "woman vampire: dark skin tone"
  },
  {
    "code_point": "1F9DC",
    "status": "fully-qualified",
    "icon": "🧜",
    "version": "E5.0",
    "description": "merperson"
  },
  {
    "code_point": "1F9DC 1F3FB",
    "status": "fully-qualified",
    "icon": "🧜🏻",
    "version": "E5.0",
    "description": "merperson: light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FC",
    "status": "fully-qualified",
    "icon": "🧜🏼",
    "version": "E5.0",
    "description": "merperson: medium-light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FD",
    "status": "fully-qualified",
    "icon": "🧜🏽",
    "version": "E5.0",
    "description": "merperson: medium skin tone"
  },
  {
    "code_point": "1F9DC 1F3FE",
    "status": "fully-qualified",
    "icon": "🧜🏾",
    "version": "E5.0",
    "description": "merperson: medium-dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FF",
    "status": "fully-qualified",
    "icon": "🧜🏿",
    "version": "E5.0",
    "description": "merperson: dark skin tone"
  },
  {
    "code_point": "1F9DC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜‍♂️",
    "version": "E5.0",
    "description": "merman"
  },
  {
    "code_point": "1F9DC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜‍♂",
    "version": "E5.0",
    "description": "merman"
  },
  {
    "code_point": "1F9DC 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏻‍♂️",
    "version": "E5.0",
    "description": "merman: light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜🏻‍♂",
    "version": "E5.0",
    "description": "merman: light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏼‍♂️",
    "version": "E5.0",
    "description": "merman: medium-light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜🏼‍♂",
    "version": "E5.0",
    "description": "merman: medium-light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏽‍♂️",
    "version": "E5.0",
    "description": "merman: medium skin tone"
  },
  {
    "code_point": "1F9DC 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜🏽‍♂",
    "version": "E5.0",
    "description": "merman: medium skin tone"
  },
  {
    "code_point": "1F9DC 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏾‍♂️",
    "version": "E5.0",
    "description": "merman: medium-dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜🏾‍♂",
    "version": "E5.0",
    "description": "merman: medium-dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏿‍♂️",
    "version": "E5.0",
    "description": "merman: dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧜🏿‍♂",
    "version": "E5.0",
    "description": "merman: dark skin tone"
  },
  {
    "code_point": "1F9DC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜‍♀️",
    "version": "E5.0",
    "description": "mermaid"
  },
  {
    "code_point": "1F9DC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜‍♀",
    "version": "E5.0",
    "description": "mermaid"
  },
  {
    "code_point": "1F9DC 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏻‍♀️",
    "version": "E5.0",
    "description": "mermaid: light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜🏻‍♀",
    "version": "E5.0",
    "description": "mermaid: light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏼‍♀️",
    "version": "E5.0",
    "description": "mermaid: medium-light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜🏼‍♀",
    "version": "E5.0",
    "description": "mermaid: medium-light skin tone"
  },
  {
    "code_point": "1F9DC 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏽‍♀️",
    "version": "E5.0",
    "description": "mermaid: medium skin tone"
  },
  {
    "code_point": "1F9DC 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜🏽‍♀",
    "version": "E5.0",
    "description": "mermaid: medium skin tone"
  },
  {
    "code_point": "1F9DC 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏾‍♀️",
    "version": "E5.0",
    "description": "mermaid: medium-dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜🏾‍♀",
    "version": "E5.0",
    "description": "mermaid: medium-dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧜🏿‍♀️",
    "version": "E5.0",
    "description": "mermaid: dark skin tone"
  },
  {
    "code_point": "1F9DC 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧜🏿‍♀",
    "version": "E5.0",
    "description": "mermaid: dark skin tone"
  },
  {
    "code_point": "1F9DD",
    "status": "fully-qualified",
    "icon": "🧝",
    "version": "E5.0",
    "description": "elf"
  },
  {
    "code_point": "1F9DD 1F3FB",
    "status": "fully-qualified",
    "icon": "🧝🏻",
    "version": "E5.0",
    "description": "elf: light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FC",
    "status": "fully-qualified",
    "icon": "🧝🏼",
    "version": "E5.0",
    "description": "elf: medium-light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FD",
    "status": "fully-qualified",
    "icon": "🧝🏽",
    "version": "E5.0",
    "description": "elf: medium skin tone"
  },
  {
    "code_point": "1F9DD 1F3FE",
    "status": "fully-qualified",
    "icon": "🧝🏾",
    "version": "E5.0",
    "description": "elf: medium-dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FF",
    "status": "fully-qualified",
    "icon": "🧝🏿",
    "version": "E5.0",
    "description": "elf: dark skin tone"
  },
  {
    "code_point": "1F9DD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝‍♂️",
    "version": "E5.0",
    "description": "man elf"
  },
  {
    "code_point": "1F9DD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝‍♂",
    "version": "E5.0",
    "description": "man elf"
  },
  {
    "code_point": "1F9DD 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏻‍♂️",
    "version": "E5.0",
    "description": "man elf: light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝🏻‍♂",
    "version": "E5.0",
    "description": "man elf: light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏼‍♂️",
    "version": "E5.0",
    "description": "man elf: medium-light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝🏼‍♂",
    "version": "E5.0",
    "description": "man elf: medium-light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏽‍♂️",
    "version": "E5.0",
    "description": "man elf: medium skin tone"
  },
  {
    "code_point": "1F9DD 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝🏽‍♂",
    "version": "E5.0",
    "description": "man elf: medium skin tone"
  },
  {
    "code_point": "1F9DD 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏾‍♂️",
    "version": "E5.0",
    "description": "man elf: medium-dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝🏾‍♂",
    "version": "E5.0",
    "description": "man elf: medium-dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏿‍♂️",
    "version": "E5.0",
    "description": "man elf: dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧝🏿‍♂",
    "version": "E5.0",
    "description": "man elf: dark skin tone"
  },
  {
    "code_point": "1F9DD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝‍♀️",
    "version": "E5.0",
    "description": "woman elf"
  },
  {
    "code_point": "1F9DD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝‍♀",
    "version": "E5.0",
    "description": "woman elf"
  },
  {
    "code_point": "1F9DD 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏻‍♀️",
    "version": "E5.0",
    "description": "woman elf: light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝🏻‍♀",
    "version": "E5.0",
    "description": "woman elf: light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏼‍♀️",
    "version": "E5.0",
    "description": "woman elf: medium-light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝🏼‍♀",
    "version": "E5.0",
    "description": "woman elf: medium-light skin tone"
  },
  {
    "code_point": "1F9DD 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏽‍♀️",
    "version": "E5.0",
    "description": "woman elf: medium skin tone"
  },
  {
    "code_point": "1F9DD 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝🏽‍♀",
    "version": "E5.0",
    "description": "woman elf: medium skin tone"
  },
  {
    "code_point": "1F9DD 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏾‍♀️",
    "version": "E5.0",
    "description": "woman elf: medium-dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝🏾‍♀",
    "version": "E5.0",
    "description": "woman elf: medium-dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧝🏿‍♀️",
    "version": "E5.0",
    "description": "woman elf: dark skin tone"
  },
  {
    "code_point": "1F9DD 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧝🏿‍♀",
    "version": "E5.0",
    "description": "woman elf: dark skin tone"
  },
  {
    "code_point": "1F9DE",
    "status": "fully-qualified",
    "icon": "🧞",
    "version": "E5.0",
    "description": "genie"
  },
  {
    "code_point": "1F9DE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧞‍♂️",
    "version": "E5.0",
    "description": "man genie"
  },
  {
    "code_point": "1F9DE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧞‍♂",
    "version": "E5.0",
    "description": "man genie"
  },
  {
    "code_point": "1F9DE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧞‍♀️",
    "version": "E5.0",
    "description": "woman genie"
  },
  {
    "code_point": "1F9DE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧞‍♀",
    "version": "E5.0",
    "description": "woman genie"
  },
  {
    "code_point": "1F9DF",
    "status": "fully-qualified",
    "icon": "🧟",
    "version": "E5.0",
    "description": "zombie"
  },
  {
    "code_point": "1F9DF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧟‍♂️",
    "version": "E5.0",
    "description": "man zombie"
  },
  {
    "code_point": "1F9DF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧟‍♂",
    "version": "E5.0",
    "description": "man zombie"
  },
  {
    "code_point": "1F9DF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧟‍♀️",
    "version": "E5.0",
    "description": "woman zombie"
  },
  {
    "code_point": "1F9DF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧟‍♀",
    "version": "E5.0",
    "description": "woman zombie"
  },
  {
    "code_point": "1F9CC",
    "status": "fully-qualified",
    "icon": "🧌",
    "version": "E14.0",
    "description": "troll"
  },
  {
    "code_point": "1F486",
    "status": "fully-qualified",
    "icon": "💆",
    "version": "E0.6",
    "description": "person getting massage"
  },
  {
    "code_point": "1F486 1F3FB",
    "status": "fully-qualified",
    "icon": "💆🏻",
    "version": "E1.0",
    "description": "person getting massage: light skin tone"
  },
  {
    "code_point": "1F486 1F3FC",
    "status": "fully-qualified",
    "icon": "💆🏼",
    "version": "E1.0",
    "description": "person getting massage: medium-light skin tone"
  },
  {
    "code_point": "1F486 1F3FD",
    "status": "fully-qualified",
    "icon": "💆🏽",
    "version": "E1.0",
    "description": "person getting massage: medium skin tone"
  },
  {
    "code_point": "1F486 1F3FE",
    "status": "fully-qualified",
    "icon": "💆🏾",
    "version": "E1.0",
    "description": "person getting massage: medium-dark skin tone"
  },
  {
    "code_point": "1F486 1F3FF",
    "status": "fully-qualified",
    "icon": "💆🏿",
    "version": "E1.0",
    "description": "person getting massage: dark skin tone"
  },
  {
    "code_point": "1F486 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆‍♂️",
    "version": "E4.0",
    "description": "man getting massage"
  },
  {
    "code_point": "1F486 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆‍♂",
    "version": "E4.0",
    "description": "man getting massage"
  },
  {
    "code_point": "1F486 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏻‍♂️",
    "version": "E4.0",
    "description": "man getting massage: light skin tone"
  },
  {
    "code_point": "1F486 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆🏻‍♂",
    "version": "E4.0",
    "description": "man getting massage: light skin tone"
  },
  {
    "code_point": "1F486 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏼‍♂️",
    "version": "E4.0",
    "description": "man getting massage: medium-light skin tone"
  },
  {
    "code_point": "1F486 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆🏼‍♂",
    "version": "E4.0",
    "description": "man getting massage: medium-light skin tone"
  },
  {
    "code_point": "1F486 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏽‍♂️",
    "version": "E4.0",
    "description": "man getting massage: medium skin tone"
  },
  {
    "code_point": "1F486 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆🏽‍♂",
    "version": "E4.0",
    "description": "man getting massage: medium skin tone"
  },
  {
    "code_point": "1F486 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏾‍♂️",
    "version": "E4.0",
    "description": "man getting massage: medium-dark skin tone"
  },
  {
    "code_point": "1F486 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆🏾‍♂",
    "version": "E4.0",
    "description": "man getting massage: medium-dark skin tone"
  },
  {
    "code_point": "1F486 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏿‍♂️",
    "version": "E4.0",
    "description": "man getting massage: dark skin tone"
  },
  {
    "code_point": "1F486 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "💆🏿‍♂",
    "version": "E4.0",
    "description": "man getting massage: dark skin tone"
  },
  {
    "code_point": "1F486 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆‍♀️",
    "version": "E4.0",
    "description": "woman getting massage"
  },
  {
    "code_point": "1F486 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆‍♀",
    "version": "E4.0",
    "description": "woman getting massage"
  },
  {
    "code_point": "1F486 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏻‍♀️",
    "version": "E4.0",
    "description": "woman getting massage: light skin tone"
  },
  {
    "code_point": "1F486 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆🏻‍♀",
    "version": "E4.0",
    "description": "woman getting massage: light skin tone"
  },
  {
    "code_point": "1F486 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏼‍♀️",
    "version": "E4.0",
    "description": "woman getting massage: medium-light skin tone"
  },
  {
    "code_point": "1F486 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆🏼‍♀",
    "version": "E4.0",
    "description": "woman getting massage: medium-light skin tone"
  },
  {
    "code_point": "1F486 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏽‍♀️",
    "version": "E4.0",
    "description": "woman getting massage: medium skin tone"
  },
  {
    "code_point": "1F486 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆🏽‍♀",
    "version": "E4.0",
    "description": "woman getting massage: medium skin tone"
  },
  {
    "code_point": "1F486 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏾‍♀️",
    "version": "E4.0",
    "description": "woman getting massage: medium-dark skin tone"
  },
  {
    "code_point": "1F486 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆🏾‍♀",
    "version": "E4.0",
    "description": "woman getting massage: medium-dark skin tone"
  },
  {
    "code_point": "1F486 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💆🏿‍♀️",
    "version": "E4.0",
    "description": "woman getting massage: dark skin tone"
  },
  {
    "code_point": "1F486 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "💆🏿‍♀",
    "version": "E4.0",
    "description": "woman getting massage: dark skin tone"
  },
  {
    "code_point": "1F487",
    "status": "fully-qualified",
    "icon": "💇",
    "version": "E0.6",
    "description": "person getting haircut"
  },
  {
    "code_point": "1F487 1F3FB",
    "status": "fully-qualified",
    "icon": "💇🏻",
    "version": "E1.0",
    "description": "person getting haircut: light skin tone"
  },
  {
    "code_point": "1F487 1F3FC",
    "status": "fully-qualified",
    "icon": "💇🏼",
    "version": "E1.0",
    "description": "person getting haircut: medium-light skin tone"
  },
  {
    "code_point": "1F487 1F3FD",
    "status": "fully-qualified",
    "icon": "💇🏽",
    "version": "E1.0",
    "description": "person getting haircut: medium skin tone"
  },
  {
    "code_point": "1F487 1F3FE",
    "status": "fully-qualified",
    "icon": "💇🏾",
    "version": "E1.0",
    "description": "person getting haircut: medium-dark skin tone"
  },
  {
    "code_point": "1F487 1F3FF",
    "status": "fully-qualified",
    "icon": "💇🏿",
    "version": "E1.0",
    "description": "person getting haircut: dark skin tone"
  },
  {
    "code_point": "1F487 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇‍♂️",
    "version": "E4.0",
    "description": "man getting haircut"
  },
  {
    "code_point": "1F487 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇‍♂",
    "version": "E4.0",
    "description": "man getting haircut"
  },
  {
    "code_point": "1F487 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏻‍♂️",
    "version": "E4.0",
    "description": "man getting haircut: light skin tone"
  },
  {
    "code_point": "1F487 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇🏻‍♂",
    "version": "E4.0",
    "description": "man getting haircut: light skin tone"
  },
  {
    "code_point": "1F487 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏼‍♂️",
    "version": "E4.0",
    "description": "man getting haircut: medium-light skin tone"
  },
  {
    "code_point": "1F487 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇🏼‍♂",
    "version": "E4.0",
    "description": "man getting haircut: medium-light skin tone"
  },
  {
    "code_point": "1F487 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏽‍♂️",
    "version": "E4.0",
    "description": "man getting haircut: medium skin tone"
  },
  {
    "code_point": "1F487 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇🏽‍♂",
    "version": "E4.0",
    "description": "man getting haircut: medium skin tone"
  },
  {
    "code_point": "1F487 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏾‍♂️",
    "version": "E4.0",
    "description": "man getting haircut: medium-dark skin tone"
  },
  {
    "code_point": "1F487 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇🏾‍♂",
    "version": "E4.0",
    "description": "man getting haircut: medium-dark skin tone"
  },
  {
    "code_point": "1F487 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏿‍♂️",
    "version": "E4.0",
    "description": "man getting haircut: dark skin tone"
  },
  {
    "code_point": "1F487 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "💇🏿‍♂",
    "version": "E4.0",
    "description": "man getting haircut: dark skin tone"
  },
  {
    "code_point": "1F487 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut"
  },
  {
    "code_point": "1F487 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇‍♀",
    "version": "E4.0",
    "description": "woman getting haircut"
  },
  {
    "code_point": "1F487 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏻‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut: light skin tone"
  },
  {
    "code_point": "1F487 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇🏻‍♀",
    "version": "E4.0",
    "description": "woman getting haircut: light skin tone"
  },
  {
    "code_point": "1F487 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏼‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut: medium-light skin tone"
  },
  {
    "code_point": "1F487 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇🏼‍♀",
    "version": "E4.0",
    "description": "woman getting haircut: medium-light skin tone"
  },
  {
    "code_point": "1F487 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏽‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut: medium skin tone"
  },
  {
    "code_point": "1F487 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇🏽‍♀",
    "version": "E4.0",
    "description": "woman getting haircut: medium skin tone"
  },
  {
    "code_point": "1F487 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏾‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut: medium-dark skin tone"
  },
  {
    "code_point": "1F487 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇🏾‍♀",
    "version": "E4.0",
    "description": "woman getting haircut: medium-dark skin tone"
  },
  {
    "code_point": "1F487 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "💇🏿‍♀️",
    "version": "E4.0",
    "description": "woman getting haircut: dark skin tone"
  },
  {
    "code_point": "1F487 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "💇🏿‍♀",
    "version": "E4.0",
    "description": "woman getting haircut: dark skin tone"
  },
  {
    "code_point": "1F6B6",
    "status": "fully-qualified",
    "icon": "🚶",
    "version": "E0.6",
    "description": "person walking"
  },
  {
    "code_point": "1F6B6 1F3FB",
    "status": "fully-qualified",
    "icon": "🚶🏻",
    "version": "E1.0",
    "description": "person walking: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC",
    "status": "fully-qualified",
    "icon": "🚶🏼",
    "version": "E1.0",
    "description": "person walking: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD",
    "status": "fully-qualified",
    "icon": "🚶🏽",
    "version": "E1.0",
    "description": "person walking: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE",
    "status": "fully-qualified",
    "icon": "🚶🏾",
    "version": "E1.0",
    "description": "person walking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF",
    "status": "fully-qualified",
    "icon": "🚶🏿",
    "version": "E1.0",
    "description": "person walking: dark skin tone"
  },
  {
    "code_point": "1F6B6 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶‍♂️",
    "version": "E4.0",
    "description": "man walking"
  },
  {
    "code_point": "1F6B6 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶‍♂",
    "version": "E4.0",
    "description": "man walking"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏻‍♂️",
    "version": "E4.0",
    "description": "man walking: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♂",
    "version": "E4.0",
    "description": "man walking: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏼‍♂️",
    "version": "E4.0",
    "description": "man walking: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♂",
    "version": "E4.0",
    "description": "man walking: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏽‍♂️",
    "version": "E4.0",
    "description": "man walking: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♂",
    "version": "E4.0",
    "description": "man walking: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏾‍♂️",
    "version": "E4.0",
    "description": "man walking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♂",
    "version": "E4.0",
    "description": "man walking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏿‍♂️",
    "version": "E4.0",
    "description": "man walking: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♂",
    "version": "E4.0",
    "description": "man walking: dark skin tone"
  },
  {
    "code_point": "1F6B6 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶‍♀️",
    "version": "E4.0",
    "description": "woman walking"
  },
  {
    "code_point": "1F6B6 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶‍♀",
    "version": "E4.0",
    "description": "woman walking"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏻‍♀️",
    "version": "E4.0",
    "description": "woman walking: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♀",
    "version": "E4.0",
    "description": "woman walking: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏼‍♀️",
    "version": "E4.0",
    "description": "woman walking: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♀",
    "version": "E4.0",
    "description": "woman walking: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏽‍♀️",
    "version": "E4.0",
    "description": "woman walking: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♀",
    "version": "E4.0",
    "description": "woman walking: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏾‍♀️",
    "version": "E4.0",
    "description": "woman walking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♀",
    "version": "E4.0",
    "description": "woman walking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏿‍♀️",
    "version": "E4.0",
    "description": "woman walking: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♀",
    "version": "E4.0",
    "description": "woman walking: dark skin tone"
  },
  {
    "code_point": "1F6B6 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶‍➡️",
    "version": "E15.1",
    "description": "person walking facing right"
  },
  {
    "code_point": "1F6B6 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶‍➡",
    "version": "E15.1",
    "description": "person walking facing right"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏻‍➡️",
    "version": "E15.1",
    "description": "person walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍➡",
    "version": "E15.1",
    "description": "person walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏼‍➡️",
    "version": "E15.1",
    "description": "person walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍➡",
    "version": "E15.1",
    "description": "person walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏽‍➡️",
    "version": "E15.1",
    "description": "person walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍➡",
    "version": "E15.1",
    "description": "person walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏾‍➡️",
    "version": "E15.1",
    "description": "person walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍➡",
    "version": "E15.1",
    "description": "person walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏿‍➡️",
    "version": "E15.1",
    "description": "person walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍➡",
    "version": "E15.1",
    "description": "person walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏻‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏼‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏽‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏾‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏿‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♀‍➡️",
    "version": "E15.1",
    "description": "woman walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♀️‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♀‍➡",
    "version": "E15.1",
    "description": "woman walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right"
  },
  {
    "code_point": "1F6B6 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏻‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FB 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏻‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right: light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏼‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FC 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏼‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium-light skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏽‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FD 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏽‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏾‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FE 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏾‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🚶🏿‍♂️‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♂‍➡️",
    "version": "E15.1",
    "description": "man walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♂️‍➡",
    "version": "E15.1",
    "description": "man walking facing right: dark skin tone"
  },
  {
    "code_point": "1F6B6 1F3FF 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🚶🏿‍♂‍➡",
    "version": "E15.1",
    "description": "man walking facing right: dark skin tone"
  },
  {
    "code_point": "1F9CD",
    "status": "fully-qualified",
    "icon": "🧍",
    "version": "E12.0",
    "description": "person standing"
  },
  {
    "code_point": "1F9CD 1F3FB",
    "status": "fully-qualified",
    "icon": "🧍🏻",
    "version": "E12.0",
    "description": "person standing: light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FC",
    "status": "fully-qualified",
    "icon": "🧍🏼",
    "version": "E12.0",
    "description": "person standing: medium-light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FD",
    "status": "fully-qualified",
    "icon": "🧍🏽",
    "version": "E12.0",
    "description": "person standing: medium skin tone"
  },
  {
    "code_point": "1F9CD 1F3FE",
    "status": "fully-qualified",
    "icon": "🧍🏾",
    "version": "E12.0",
    "description": "person standing: medium-dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FF",
    "status": "fully-qualified",
    "icon": "🧍🏿",
    "version": "E12.0",
    "description": "person standing: dark skin tone"
  },
  {
    "code_point": "1F9CD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍‍♂️",
    "version": "E12.0",
    "description": "man standing"
  },
  {
    "code_point": "1F9CD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍‍♂",
    "version": "E12.0",
    "description": "man standing"
  },
  {
    "code_point": "1F9CD 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏻‍♂️",
    "version": "E12.0",
    "description": "man standing: light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍🏻‍♂",
    "version": "E12.0",
    "description": "man standing: light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏼‍♂️",
    "version": "E12.0",
    "description": "man standing: medium-light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍🏼‍♂",
    "version": "E12.0",
    "description": "man standing: medium-light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏽‍♂️",
    "version": "E12.0",
    "description": "man standing: medium skin tone"
  },
  {
    "code_point": "1F9CD 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍🏽‍♂",
    "version": "E12.0",
    "description": "man standing: medium skin tone"
  },
  {
    "code_point": "1F9CD 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏾‍♂️",
    "version": "E12.0",
    "description": "man standing: medium-dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍🏾‍♂",
    "version": "E12.0",
    "description": "man standing: medium-dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏿‍♂️",
    "version": "E12.0",
    "description": "man standing: dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧍🏿‍♂",
    "version": "E12.0",
    "description": "man standing: dark skin tone"
  },
  {
    "code_point": "1F9CD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍‍♀️",
    "version": "E12.0",
    "description": "woman standing"
  },
  {
    "code_point": "1F9CD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍‍♀",
    "version": "E12.0",
    "description": "woman standing"
  },
  {
    "code_point": "1F9CD 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏻‍♀️",
    "version": "E12.0",
    "description": "woman standing: light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍🏻‍♀",
    "version": "E12.0",
    "description": "woman standing: light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏼‍♀️",
    "version": "E12.0",
    "description": "woman standing: medium-light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍🏼‍♀",
    "version": "E12.0",
    "description": "woman standing: medium-light skin tone"
  },
  {
    "code_point": "1F9CD 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏽‍♀️",
    "version": "E12.0",
    "description": "woman standing: medium skin tone"
  },
  {
    "code_point": "1F9CD 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍🏽‍♀",
    "version": "E12.0",
    "description": "woman standing: medium skin tone"
  },
  {
    "code_point": "1F9CD 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏾‍♀️",
    "version": "E12.0",
    "description": "woman standing: medium-dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍🏾‍♀",
    "version": "E12.0",
    "description": "woman standing: medium-dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧍🏿‍♀️",
    "version": "E12.0",
    "description": "woman standing: dark skin tone"
  },
  {
    "code_point": "1F9CD 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧍🏿‍♀",
    "version": "E12.0",
    "description": "woman standing: dark skin tone"
  },
  {
    "code_point": "1F9CE",
    "status": "fully-qualified",
    "icon": "🧎",
    "version": "E12.0",
    "description": "person kneeling"
  },
  {
    "code_point": "1F9CE 1F3FB",
    "status": "fully-qualified",
    "icon": "🧎🏻",
    "version": "E12.0",
    "description": "person kneeling: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC",
    "status": "fully-qualified",
    "icon": "🧎🏼",
    "version": "E12.0",
    "description": "person kneeling: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD",
    "status": "fully-qualified",
    "icon": "🧎🏽",
    "version": "E12.0",
    "description": "person kneeling: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE",
    "status": "fully-qualified",
    "icon": "🧎🏾",
    "version": "E12.0",
    "description": "person kneeling: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF",
    "status": "fully-qualified",
    "icon": "🧎🏿",
    "version": "E12.0",
    "description": "person kneeling: dark skin tone"
  },
  {
    "code_point": "1F9CE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎‍♂️",
    "version": "E12.0",
    "description": "man kneeling"
  },
  {
    "code_point": "1F9CE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎‍♂",
    "version": "E12.0",
    "description": "man kneeling"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏻‍♂️",
    "version": "E12.0",
    "description": "man kneeling: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♂",
    "version": "E12.0",
    "description": "man kneeling: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏼‍♂️",
    "version": "E12.0",
    "description": "man kneeling: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♂",
    "version": "E12.0",
    "description": "man kneeling: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏽‍♂️",
    "version": "E12.0",
    "description": "man kneeling: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♂",
    "version": "E12.0",
    "description": "man kneeling: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏾‍♂️",
    "version": "E12.0",
    "description": "man kneeling: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♂",
    "version": "E12.0",
    "description": "man kneeling: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏿‍♂️",
    "version": "E12.0",
    "description": "man kneeling: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♂",
    "version": "E12.0",
    "description": "man kneeling: dark skin tone"
  },
  {
    "code_point": "1F9CE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎‍♀️",
    "version": "E12.0",
    "description": "woman kneeling"
  },
  {
    "code_point": "1F9CE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎‍♀",
    "version": "E12.0",
    "description": "woman kneeling"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏻‍♀️",
    "version": "E12.0",
    "description": "woman kneeling: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♀",
    "version": "E12.0",
    "description": "woman kneeling: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏼‍♀️",
    "version": "E12.0",
    "description": "woman kneeling: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♀",
    "version": "E12.0",
    "description": "woman kneeling: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏽‍♀️",
    "version": "E12.0",
    "description": "woman kneeling: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♀",
    "version": "E12.0",
    "description": "woman kneeling: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏾‍♀️",
    "version": "E12.0",
    "description": "woman kneeling: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♀",
    "version": "E12.0",
    "description": "woman kneeling: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏿‍♀️",
    "version": "E12.0",
    "description": "woman kneeling: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♀",
    "version": "E12.0",
    "description": "woman kneeling: dark skin tone"
  },
  {
    "code_point": "1F9CE 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏻‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏼‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏽‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏾‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏿‍➡️",
    "version": "E15.1",
    "description": "person kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍➡",
    "version": "E15.1",
    "description": "person kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏻‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏼‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏽‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏾‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏿‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♀‍➡️",
    "version": "E15.1",
    "description": "woman kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♀️‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♀‍➡",
    "version": "E15.1",
    "description": "woman kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right"
  },
  {
    "code_point": "1F9CE 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏻‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FB 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏻‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏼‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FC 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏼‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏽‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FD 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏽‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏾‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FE 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏾‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧎🏿‍♂️‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♂‍➡️",
    "version": "E15.1",
    "description": "man kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♂️‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9CE 1F3FF 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧎🏿‍♂‍➡",
    "version": "E15.1",
    "description": "man kneeling facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑‍🦯",
    "version": "E12.1",
    "description": "person with white cane"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦯",
    "version": "E12.1",
    "description": "person with white cane: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦯",
    "version": "E12.1",
    "description": "person with white cane: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦯",
    "version": "E12.1",
    "description": "person with white cane: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦯",
    "version": "E12.1",
    "description": "person with white cane: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦯",
    "version": "E12.1",
    "description": "person with white cane: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right"
  },
  {
    "code_point": "1F9D1 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦯‍➡️",
    "version": "E15.1",
    "description": "person with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍🦯‍➡",
    "version": "E15.1",
    "description": "person with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨‍🦯",
    "version": "E12.0",
    "description": "man with white cane"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦯",
    "version": "E12.0",
    "description": "man with white cane: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦯",
    "version": "E12.0",
    "description": "man with white cane: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦯",
    "version": "E12.0",
    "description": "man with white cane: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦯",
    "version": "E12.0",
    "description": "man with white cane: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦯",
    "version": "E12.0",
    "description": "man with white cane: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right"
  },
  {
    "code_point": "1F468 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏻‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏼‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏽‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏾‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦯‍➡️",
    "version": "E15.1",
    "description": "man with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏿‍🦯‍➡",
    "version": "E15.1",
    "description": "man with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩‍🦯",
    "version": "E12.0",
    "description": "woman with white cane"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦯",
    "version": "E12.0",
    "description": "woman with white cane: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦯",
    "version": "E12.0",
    "description": "woman with white cane: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦯",
    "version": "E12.0",
    "description": "woman with white cane: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦯",
    "version": "E12.0",
    "description": "woman with white cane: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9AF",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦯",
    "version": "E12.0",
    "description": "woman with white cane: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right"
  },
  {
    "code_point": "1F469 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏻‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏼‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏽‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏾‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9AF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦯‍➡️",
    "version": "E15.1",
    "description": "woman with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9AF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏿‍🦯‍➡",
    "version": "E15.1",
    "description": "woman with white cane facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦼",
    "version": "E12.1",
    "description": "person in motorized wheelchair: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right"
  },
  {
    "code_point": "1F9D1 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦼‍➡️",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍🦼‍➡",
    "version": "E15.1",
    "description": "person in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦼",
    "version": "E12.0",
    "description": "man in motorized wheelchair: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right"
  },
  {
    "code_point": "1F468 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏻‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏼‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏽‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏾‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦼‍➡️",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏿‍🦼‍➡",
    "version": "E15.1",
    "description": "man in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BC",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦼",
    "version": "E12.0",
    "description": "woman in motorized wheelchair: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right"
  },
  {
    "code_point": "1F469 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏻‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏼‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏽‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏾‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦼‍➡️",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏿‍🦼‍➡",
    "version": "E15.1",
    "description": "woman in motorized wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦽",
    "version": "E12.1",
    "description": "person in manual wheelchair: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right"
  },
  {
    "code_point": "1F9D1 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🦽‍➡️",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍🦽‍➡",
    "version": "E15.1",
    "description": "person in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦽",
    "version": "E12.0",
    "description": "man in manual wheelchair: dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right"
  },
  {
    "code_point": "1F468 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏻‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏻‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏼‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏼‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏽‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏽‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏾‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏾‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👨🏿‍🦽‍➡️",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👨🏿‍🦽‍➡",
    "version": "E15.1",
    "description": "man in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BD",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦽",
    "version": "E12.0",
    "description": "woman in manual wheelchair: dark skin tone"
  },
  {
    "code_point": "1F469 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right"
  },
  {
    "code_point": "1F469 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏻‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏻‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏼‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏼‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏽‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏽‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏾‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏾‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "👩🏿‍🦽‍➡️",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F9BD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "👩🏿‍🦽‍➡",
    "version": "E15.1",
    "description": "woman in manual wheelchair facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3",
    "status": "fully-qualified",
    "icon": "🏃",
    "version": "E0.6",
    "description": "person running"
  },
  {
    "code_point": "1F3C3 1F3FB",
    "status": "fully-qualified",
    "icon": "🏃🏻",
    "version": "E1.0",
    "description": "person running: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC",
    "status": "fully-qualified",
    "icon": "🏃🏼",
    "version": "E1.0",
    "description": "person running: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD",
    "status": "fully-qualified",
    "icon": "🏃🏽",
    "version": "E1.0",
    "description": "person running: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE",
    "status": "fully-qualified",
    "icon": "🏃🏾",
    "version": "E1.0",
    "description": "person running: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF",
    "status": "fully-qualified",
    "icon": "🏃🏿",
    "version": "E1.0",
    "description": "person running: dark skin tone"
  },
  {
    "code_point": "1F3C3 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃‍♂️",
    "version": "E4.0",
    "description": "man running"
  },
  {
    "code_point": "1F3C3 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃‍♂",
    "version": "E4.0",
    "description": "man running"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏻‍♂️",
    "version": "E4.0",
    "description": "man running: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♂",
    "version": "E4.0",
    "description": "man running: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏼‍♂️",
    "version": "E4.0",
    "description": "man running: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♂",
    "version": "E4.0",
    "description": "man running: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏽‍♂️",
    "version": "E4.0",
    "description": "man running: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♂",
    "version": "E4.0",
    "description": "man running: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏾‍♂️",
    "version": "E4.0",
    "description": "man running: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♂",
    "version": "E4.0",
    "description": "man running: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏿‍♂️",
    "version": "E4.0",
    "description": "man running: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♂",
    "version": "E4.0",
    "description": "man running: dark skin tone"
  },
  {
    "code_point": "1F3C3 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃‍♀️",
    "version": "E4.0",
    "description": "woman running"
  },
  {
    "code_point": "1F3C3 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃‍♀",
    "version": "E4.0",
    "description": "woman running"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏻‍♀️",
    "version": "E4.0",
    "description": "woman running: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♀",
    "version": "E4.0",
    "description": "woman running: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏼‍♀️",
    "version": "E4.0",
    "description": "woman running: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♀",
    "version": "E4.0",
    "description": "woman running: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏽‍♀️",
    "version": "E4.0",
    "description": "woman running: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♀",
    "version": "E4.0",
    "description": "woman running: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏾‍♀️",
    "version": "E4.0",
    "description": "woman running: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♀",
    "version": "E4.0",
    "description": "woman running: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏿‍♀️",
    "version": "E4.0",
    "description": "woman running: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♀",
    "version": "E4.0",
    "description": "woman running: dark skin tone"
  },
  {
    "code_point": "1F3C3 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃‍➡️",
    "version": "E15.1",
    "description": "person running facing right"
  },
  {
    "code_point": "1F3C3 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃‍➡",
    "version": "E15.1",
    "description": "person running facing right"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏻‍➡️",
    "version": "E15.1",
    "description": "person running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍➡",
    "version": "E15.1",
    "description": "person running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏼‍➡️",
    "version": "E15.1",
    "description": "person running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍➡",
    "version": "E15.1",
    "description": "person running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏽‍➡️",
    "version": "E15.1",
    "description": "person running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍➡",
    "version": "E15.1",
    "description": "person running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏾‍➡️",
    "version": "E15.1",
    "description": "person running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍➡",
    "version": "E15.1",
    "description": "person running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏿‍➡️",
    "version": "E15.1",
    "description": "person running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍➡",
    "version": "E15.1",
    "description": "person running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right"
  },
  {
    "code_point": "1F3C3 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right"
  },
  {
    "code_point": "1F3C3 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right"
  },
  {
    "code_point": "1F3C3 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏻‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏼‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏽‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏾‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏿‍♀️‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♀‍➡️",
    "version": "E15.1",
    "description": "woman running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♀️‍➡",
    "version": "E15.1",
    "description": "woman running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2640 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♀‍➡",
    "version": "E15.1",
    "description": "woman running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right"
  },
  {
    "code_point": "1F3C3 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right"
  },
  {
    "code_point": "1F3C3 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right"
  },
  {
    "code_point": "1F3C3 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏻‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FB 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏻‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right: light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏼‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FC 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏼‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium-light skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏽‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FD 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏽‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏾‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FE 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏾‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right: medium-dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642 FE0F 200D 27A1 FE0F",
    "status": "fully-qualified",
    "icon": "🏃🏿‍♂️‍➡️",
    "version": "E15.1",
    "description": "man running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642 200D 27A1 FE0F",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♂‍➡️",
    "version": "E15.1",
    "description": "man running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642 FE0F 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♂️‍➡",
    "version": "E15.1",
    "description": "man running facing right: dark skin tone"
  },
  {
    "code_point": "1F3C3 1F3FF 200D 2642 200D 27A1",
    "status": "minimally-qualified",
    "icon": "🏃🏿‍♂‍➡",
    "version": "E15.1",
    "description": "man running facing right: dark skin tone"
  },
  {
    "code_point": "1F483",
    "status": "fully-qualified",
    "icon": "💃",
    "version": "E0.6",
    "description": "woman dancing"
  },
  {
    "code_point": "1F483 1F3FB",
    "status": "fully-qualified",
    "icon": "💃🏻",
    "version": "E1.0",
    "description": "woman dancing: light skin tone"
  },
  {
    "code_point": "1F483 1F3FC",
    "status": "fully-qualified",
    "icon": "💃🏼",
    "version": "E1.0",
    "description": "woman dancing: medium-light skin tone"
  },
  {
    "code_point": "1F483 1F3FD",
    "status": "fully-qualified",
    "icon": "💃🏽",
    "version": "E1.0",
    "description": "woman dancing: medium skin tone"
  },
  {
    "code_point": "1F483 1F3FE",
    "status": "fully-qualified",
    "icon": "💃🏾",
    "version": "E1.0",
    "description": "woman dancing: medium-dark skin tone"
  },
  {
    "code_point": "1F483 1F3FF",
    "status": "fully-qualified",
    "icon": "💃🏿",
    "version": "E1.0",
    "description": "woman dancing: dark skin tone"
  },
  {
    "code_point": "1F57A",
    "status": "fully-qualified",
    "icon": "🕺",
    "version": "E3.0",
    "description": "man dancing"
  },
  {
    "code_point": "1F57A 1F3FB",
    "status": "fully-qualified",
    "icon": "🕺🏻",
    "version": "E3.0",
    "description": "man dancing: light skin tone"
  },
  {
    "code_point": "1F57A 1F3FC",
    "status": "fully-qualified",
    "icon": "🕺🏼",
    "version": "E3.0",
    "description": "man dancing: medium-light skin tone"
  },
  {
    "code_point": "1F57A 1F3FD",
    "status": "fully-qualified",
    "icon": "🕺🏽",
    "version": "E3.0",
    "description": "man dancing: medium skin tone"
  },
  {
    "code_point": "1F57A 1F3FE",
    "status": "fully-qualified",
    "icon": "🕺🏾",
    "version": "E3.0",
    "description": "man dancing: medium-dark skin tone"
  },
  {
    "code_point": "1F57A 1F3FF",
    "status": "fully-qualified",
    "icon": "🕺🏿",
    "version": "E3.0",
    "description": "man dancing: dark skin tone"
  },
  {
    "code_point": "1F574 FE0F",
    "status": "fully-qualified",
    "icon": "🕴️",
    "version": "E0.7",
    "description": "person in suit levitating"
  },
  {
    "code_point": "1F574",
    "status": "unqualified",
    "icon": "🕴",
    "version": "E0.7",
    "description": "person in suit levitating"
  },
  {
    "code_point": "1F574 1F3FB",
    "status": "fully-qualified",
    "icon": "🕴🏻",
    "version": "E4.0",
    "description": "person in suit levitating: light skin tone"
  },
  {
    "code_point": "1F574 1F3FC",
    "status": "fully-qualified",
    "icon": "🕴🏼",
    "version": "E4.0",
    "description": "person in suit levitating: medium-light skin tone"
  },
  {
    "code_point": "1F574 1F3FD",
    "status": "fully-qualified",
    "icon": "🕴🏽",
    "version": "E4.0",
    "description": "person in suit levitating: medium skin tone"
  },
  {
    "code_point": "1F574 1F3FE",
    "status": "fully-qualified",
    "icon": "🕴🏾",
    "version": "E4.0",
    "description": "person in suit levitating: medium-dark skin tone"
  },
  {
    "code_point": "1F574 1F3FF",
    "status": "fully-qualified",
    "icon": "🕴🏿",
    "version": "E4.0",
    "description": "person in suit levitating: dark skin tone"
  },
  {
    "code_point": "1F46F",
    "status": "fully-qualified",
    "icon": "👯",
    "version": "E0.6",
    "description": "people with bunny ears"
  },
  {
    "code_point": "1F46F 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "👯‍♂️",
    "version": "E4.0",
    "description": "men with bunny ears"
  },
  {
    "code_point": "1F46F 200D 2642",
    "status": "minimally-qualified",
    "icon": "👯‍♂",
    "version": "E4.0",
    "description": "men with bunny ears"
  },
  {
    "code_point": "1F46F 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "👯‍♀️",
    "version": "E4.0",
    "description": "women with bunny ears"
  },
  {
    "code_point": "1F46F 200D 2640",
    "status": "minimally-qualified",
    "icon": "👯‍♀",
    "version": "E4.0",
    "description": "women with bunny ears"
  },
  {
    "code_point": "1F9D6",
    "status": "fully-qualified",
    "icon": "🧖",
    "version": "E5.0",
    "description": "person in steamy room"
  },
  {
    "code_point": "1F9D6 1F3FB",
    "status": "fully-qualified",
    "icon": "🧖🏻",
    "version": "E5.0",
    "description": "person in steamy room: light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FC",
    "status": "fully-qualified",
    "icon": "🧖🏼",
    "version": "E5.0",
    "description": "person in steamy room: medium-light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FD",
    "status": "fully-qualified",
    "icon": "🧖🏽",
    "version": "E5.0",
    "description": "person in steamy room: medium skin tone"
  },
  {
    "code_point": "1F9D6 1F3FE",
    "status": "fully-qualified",
    "icon": "🧖🏾",
    "version": "E5.0",
    "description": "person in steamy room: medium-dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FF",
    "status": "fully-qualified",
    "icon": "🧖🏿",
    "version": "E5.0",
    "description": "person in steamy room: dark skin tone"
  },
  {
    "code_point": "1F9D6 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖‍♂️",
    "version": "E5.0",
    "description": "man in steamy room"
  },
  {
    "code_point": "1F9D6 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖‍♂",
    "version": "E5.0",
    "description": "man in steamy room"
  },
  {
    "code_point": "1F9D6 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏻‍♂️",
    "version": "E5.0",
    "description": "man in steamy room: light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖🏻‍♂",
    "version": "E5.0",
    "description": "man in steamy room: light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏼‍♂️",
    "version": "E5.0",
    "description": "man in steamy room: medium-light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖🏼‍♂",
    "version": "E5.0",
    "description": "man in steamy room: medium-light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏽‍♂️",
    "version": "E5.0",
    "description": "man in steamy room: medium skin tone"
  },
  {
    "code_point": "1F9D6 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖🏽‍♂",
    "version": "E5.0",
    "description": "man in steamy room: medium skin tone"
  },
  {
    "code_point": "1F9D6 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏾‍♂️",
    "version": "E5.0",
    "description": "man in steamy room: medium-dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖🏾‍♂",
    "version": "E5.0",
    "description": "man in steamy room: medium-dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏿‍♂️",
    "version": "E5.0",
    "description": "man in steamy room: dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧖🏿‍♂",
    "version": "E5.0",
    "description": "man in steamy room: dark skin tone"
  },
  {
    "code_point": "1F9D6 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room"
  },
  {
    "code_point": "1F9D6 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖‍♀",
    "version": "E5.0",
    "description": "woman in steamy room"
  },
  {
    "code_point": "1F9D6 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏻‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room: light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖🏻‍♀",
    "version": "E5.0",
    "description": "woman in steamy room: light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏼‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room: medium-light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖🏼‍♀",
    "version": "E5.0",
    "description": "woman in steamy room: medium-light skin tone"
  },
  {
    "code_point": "1F9D6 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏽‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room: medium skin tone"
  },
  {
    "code_point": "1F9D6 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖🏽‍♀",
    "version": "E5.0",
    "description": "woman in steamy room: medium skin tone"
  },
  {
    "code_point": "1F9D6 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏾‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room: medium-dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖🏾‍♀",
    "version": "E5.0",
    "description": "woman in steamy room: medium-dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧖🏿‍♀️",
    "version": "E5.0",
    "description": "woman in steamy room: dark skin tone"
  },
  {
    "code_point": "1F9D6 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧖🏿‍♀",
    "version": "E5.0",
    "description": "woman in steamy room: dark skin tone"
  },
  {
    "code_point": "1F9D7",
    "status": "fully-qualified",
    "icon": "🧗",
    "version": "E5.0",
    "description": "person climbing"
  },
  {
    "code_point": "1F9D7 1F3FB",
    "status": "fully-qualified",
    "icon": "🧗🏻",
    "version": "E5.0",
    "description": "person climbing: light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FC",
    "status": "fully-qualified",
    "icon": "🧗🏼",
    "version": "E5.0",
    "description": "person climbing: medium-light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FD",
    "status": "fully-qualified",
    "icon": "🧗🏽",
    "version": "E5.0",
    "description": "person climbing: medium skin tone"
  },
  {
    "code_point": "1F9D7 1F3FE",
    "status": "fully-qualified",
    "icon": "🧗🏾",
    "version": "E5.0",
    "description": "person climbing: medium-dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FF",
    "status": "fully-qualified",
    "icon": "🧗🏿",
    "version": "E5.0",
    "description": "person climbing: dark skin tone"
  },
  {
    "code_point": "1F9D7 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗‍♂️",
    "version": "E5.0",
    "description": "man climbing"
  },
  {
    "code_point": "1F9D7 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗‍♂",
    "version": "E5.0",
    "description": "man climbing"
  },
  {
    "code_point": "1F9D7 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏻‍♂️",
    "version": "E5.0",
    "description": "man climbing: light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗🏻‍♂",
    "version": "E5.0",
    "description": "man climbing: light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏼‍♂️",
    "version": "E5.0",
    "description": "man climbing: medium-light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗🏼‍♂",
    "version": "E5.0",
    "description": "man climbing: medium-light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏽‍♂️",
    "version": "E5.0",
    "description": "man climbing: medium skin tone"
  },
  {
    "code_point": "1F9D7 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗🏽‍♂",
    "version": "E5.0",
    "description": "man climbing: medium skin tone"
  },
  {
    "code_point": "1F9D7 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏾‍♂️",
    "version": "E5.0",
    "description": "man climbing: medium-dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗🏾‍♂",
    "version": "E5.0",
    "description": "man climbing: medium-dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏿‍♂️",
    "version": "E5.0",
    "description": "man climbing: dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧗🏿‍♂",
    "version": "E5.0",
    "description": "man climbing: dark skin tone"
  },
  {
    "code_point": "1F9D7 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗‍♀️",
    "version": "E5.0",
    "description": "woman climbing"
  },
  {
    "code_point": "1F9D7 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗‍♀",
    "version": "E5.0",
    "description": "woman climbing"
  },
  {
    "code_point": "1F9D7 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏻‍♀️",
    "version": "E5.0",
    "description": "woman climbing: light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗🏻‍♀",
    "version": "E5.0",
    "description": "woman climbing: light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏼‍♀️",
    "version": "E5.0",
    "description": "woman climbing: medium-light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗🏼‍♀",
    "version": "E5.0",
    "description": "woman climbing: medium-light skin tone"
  },
  {
    "code_point": "1F9D7 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏽‍♀️",
    "version": "E5.0",
    "description": "woman climbing: medium skin tone"
  },
  {
    "code_point": "1F9D7 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗🏽‍♀",
    "version": "E5.0",
    "description": "woman climbing: medium skin tone"
  },
  {
    "code_point": "1F9D7 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏾‍♀️",
    "version": "E5.0",
    "description": "woman climbing: medium-dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗🏾‍♀",
    "version": "E5.0",
    "description": "woman climbing: medium-dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧗🏿‍♀️",
    "version": "E5.0",
    "description": "woman climbing: dark skin tone"
  },
  {
    "code_point": "1F9D7 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧗🏿‍♀",
    "version": "E5.0",
    "description": "woman climbing: dark skin tone"
  },
  {
    "code_point": "1F93A",
    "status": "fully-qualified",
    "icon": "🤺",
    "version": "E3.0",
    "description": "person fencing"
  },
  {
    "code_point": "1F3C7",
    "status": "fully-qualified",
    "icon": "🏇",
    "version": "E1.0",
    "description": "horse racing"
  },
  {
    "code_point": "1F3C7 1F3FB",
    "status": "fully-qualified",
    "icon": "🏇🏻",
    "version": "E1.0",
    "description": "horse racing: light skin tone"
  },
  {
    "code_point": "1F3C7 1F3FC",
    "status": "fully-qualified",
    "icon": "🏇🏼",
    "version": "E1.0",
    "description": "horse racing: medium-light skin tone"
  },
  {
    "code_point": "1F3C7 1F3FD",
    "status": "fully-qualified",
    "icon": "🏇🏽",
    "version": "E1.0",
    "description": "horse racing: medium skin tone"
  },
  {
    "code_point": "1F3C7 1F3FE",
    "status": "fully-qualified",
    "icon": "🏇🏾",
    "version": "E1.0",
    "description": "horse racing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C7 1F3FF",
    "status": "fully-qualified",
    "icon": "🏇🏿",
    "version": "E1.0",
    "description": "horse racing: dark skin tone"
  },
  {
    "code_point": "26F7 FE0F",
    "status": "fully-qualified",
    "icon": "⛷️",
    "version": "E0.7",
    "description": "skier"
  },
  {
    "code_point": "26F7",
    "status": "unqualified",
    "icon": "⛷",
    "version": "E0.7",
    "description": "skier"
  },
  {
    "code_point": "1F3C2",
    "status": "fully-qualified",
    "icon": "🏂",
    "version": "E0.6",
    "description": "snowboarder"
  },
  {
    "code_point": "1F3C2 1F3FB",
    "status": "fully-qualified",
    "icon": "🏂🏻",
    "version": "E1.0",
    "description": "snowboarder: light skin tone"
  },
  {
    "code_point": "1F3C2 1F3FC",
    "status": "fully-qualified",
    "icon": "🏂🏼",
    "version": "E1.0",
    "description": "snowboarder: medium-light skin tone"
  },
  {
    "code_point": "1F3C2 1F3FD",
    "status": "fully-qualified",
    "icon": "🏂🏽",
    "version": "E1.0",
    "description": "snowboarder: medium skin tone"
  },
  {
    "code_point": "1F3C2 1F3FE",
    "status": "fully-qualified",
    "icon": "🏂🏾",
    "version": "E1.0",
    "description": "snowboarder: medium-dark skin tone"
  },
  {
    "code_point": "1F3C2 1F3FF",
    "status": "fully-qualified",
    "icon": "🏂🏿",
    "version": "E1.0",
    "description": "snowboarder: dark skin tone"
  },
  {
    "code_point": "1F3CC FE0F",
    "status": "fully-qualified",
    "icon": "🏌️",
    "version": "E0.7",
    "description": "person golfing"
  },
  {
    "code_point": "1F3CC",
    "status": "unqualified",
    "icon": "🏌",
    "version": "E0.7",
    "description": "person golfing"
  },
  {
    "code_point": "1F3CC 1F3FB",
    "status": "fully-qualified",
    "icon": "🏌🏻",
    "version": "E4.0",
    "description": "person golfing: light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FC",
    "status": "fully-qualified",
    "icon": "🏌🏼",
    "version": "E4.0",
    "description": "person golfing: medium-light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FD",
    "status": "fully-qualified",
    "icon": "🏌🏽",
    "version": "E4.0",
    "description": "person golfing: medium skin tone"
  },
  {
    "code_point": "1F3CC 1F3FE",
    "status": "fully-qualified",
    "icon": "🏌🏾",
    "version": "E4.0",
    "description": "person golfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FF",
    "status": "fully-qualified",
    "icon": "🏌🏿",
    "version": "E4.0",
    "description": "person golfing: dark skin tone"
  },
  {
    "code_point": "1F3CC FE0F 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌️‍♂️",
    "version": "E4.0",
    "description": "man golfing"
  },
  {
    "code_point": "1F3CC 200D 2642 FE0F",
    "status": "unqualified",
    "icon": "🏌‍♂️",
    "version": "E4.0",
    "description": "man golfing"
  },
  {
    "code_point": "1F3CC FE0F 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌️‍♂",
    "version": "E4.0",
    "description": "man golfing"
  },
  {
    "code_point": "1F3CC 200D 2642",
    "status": "unqualified",
    "icon": "🏌‍♂",
    "version": "E4.0",
    "description": "man golfing"
  },
  {
    "code_point": "1F3CC 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏻‍♂️",
    "version": "E4.0",
    "description": "man golfing: light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌🏻‍♂",
    "version": "E4.0",
    "description": "man golfing: light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏼‍♂️",
    "version": "E4.0",
    "description": "man golfing: medium-light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌🏼‍♂",
    "version": "E4.0",
    "description": "man golfing: medium-light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏽‍♂️",
    "version": "E4.0",
    "description": "man golfing: medium skin tone"
  },
  {
    "code_point": "1F3CC 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌🏽‍♂",
    "version": "E4.0",
    "description": "man golfing: medium skin tone"
  },
  {
    "code_point": "1F3CC 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏾‍♂️",
    "version": "E4.0",
    "description": "man golfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌🏾‍♂",
    "version": "E4.0",
    "description": "man golfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏿‍♂️",
    "version": "E4.0",
    "description": "man golfing: dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏌🏿‍♂",
    "version": "E4.0",
    "description": "man golfing: dark skin tone"
  },
  {
    "code_point": "1F3CC FE0F 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌️‍♀️",
    "version": "E4.0",
    "description": "woman golfing"
  },
  {
    "code_point": "1F3CC 200D 2640 FE0F",
    "status": "unqualified",
    "icon": "🏌‍♀️",
    "version": "E4.0",
    "description": "woman golfing"
  },
  {
    "code_point": "1F3CC FE0F 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌️‍♀",
    "version": "E4.0",
    "description": "woman golfing"
  },
  {
    "code_point": "1F3CC 200D 2640",
    "status": "unqualified",
    "icon": "🏌‍♀",
    "version": "E4.0",
    "description": "woman golfing"
  },
  {
    "code_point": "1F3CC 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏻‍♀️",
    "version": "E4.0",
    "description": "woman golfing: light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌🏻‍♀",
    "version": "E4.0",
    "description": "woman golfing: light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏼‍♀️",
    "version": "E4.0",
    "description": "woman golfing: medium-light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌🏼‍♀",
    "version": "E4.0",
    "description": "woman golfing: medium-light skin tone"
  },
  {
    "code_point": "1F3CC 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏽‍♀️",
    "version": "E4.0",
    "description": "woman golfing: medium skin tone"
  },
  {
    "code_point": "1F3CC 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌🏽‍♀",
    "version": "E4.0",
    "description": "woman golfing: medium skin tone"
  },
  {
    "code_point": "1F3CC 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏾‍♀️",
    "version": "E4.0",
    "description": "woman golfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌🏾‍♀",
    "version": "E4.0",
    "description": "woman golfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏌🏿‍♀️",
    "version": "E4.0",
    "description": "woman golfing: dark skin tone"
  },
  {
    "code_point": "1F3CC 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏌🏿‍♀",
    "version": "E4.0",
    "description": "woman golfing: dark skin tone"
  },
  {
    "code_point": "1F3C4",
    "status": "fully-qualified",
    "icon": "🏄",
    "version": "E0.6",
    "description": "person surfing"
  },
  {
    "code_point": "1F3C4 1F3FB",
    "status": "fully-qualified",
    "icon": "🏄🏻",
    "version": "E1.0",
    "description": "person surfing: light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FC",
    "status": "fully-qualified",
    "icon": "🏄🏼",
    "version": "E1.0",
    "description": "person surfing: medium-light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FD",
    "status": "fully-qualified",
    "icon": "🏄🏽",
    "version": "E1.0",
    "description": "person surfing: medium skin tone"
  },
  {
    "code_point": "1F3C4 1F3FE",
    "status": "fully-qualified",
    "icon": "🏄🏾",
    "version": "E1.0",
    "description": "person surfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FF",
    "status": "fully-qualified",
    "icon": "🏄🏿",
    "version": "E1.0",
    "description": "person surfing: dark skin tone"
  },
  {
    "code_point": "1F3C4 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄‍♂️",
    "version": "E4.0",
    "description": "man surfing"
  },
  {
    "code_point": "1F3C4 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄‍♂",
    "version": "E4.0",
    "description": "man surfing"
  },
  {
    "code_point": "1F3C4 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏻‍♂️",
    "version": "E4.0",
    "description": "man surfing: light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄🏻‍♂",
    "version": "E4.0",
    "description": "man surfing: light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏼‍♂️",
    "version": "E4.0",
    "description": "man surfing: medium-light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄🏼‍♂",
    "version": "E4.0",
    "description": "man surfing: medium-light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏽‍♂️",
    "version": "E4.0",
    "description": "man surfing: medium skin tone"
  },
  {
    "code_point": "1F3C4 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄🏽‍♂",
    "version": "E4.0",
    "description": "man surfing: medium skin tone"
  },
  {
    "code_point": "1F3C4 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏾‍♂️",
    "version": "E4.0",
    "description": "man surfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄🏾‍♂",
    "version": "E4.0",
    "description": "man surfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏿‍♂️",
    "version": "E4.0",
    "description": "man surfing: dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏄🏿‍♂",
    "version": "E4.0",
    "description": "man surfing: dark skin tone"
  },
  {
    "code_point": "1F3C4 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄‍♀️",
    "version": "E4.0",
    "description": "woman surfing"
  },
  {
    "code_point": "1F3C4 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄‍♀",
    "version": "E4.0",
    "description": "woman surfing"
  },
  {
    "code_point": "1F3C4 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏻‍♀️",
    "version": "E4.0",
    "description": "woman surfing: light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄🏻‍♀",
    "version": "E4.0",
    "description": "woman surfing: light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏼‍♀️",
    "version": "E4.0",
    "description": "woman surfing: medium-light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄🏼‍♀",
    "version": "E4.0",
    "description": "woman surfing: medium-light skin tone"
  },
  {
    "code_point": "1F3C4 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏽‍♀️",
    "version": "E4.0",
    "description": "woman surfing: medium skin tone"
  },
  {
    "code_point": "1F3C4 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄🏽‍♀",
    "version": "E4.0",
    "description": "woman surfing: medium skin tone"
  },
  {
    "code_point": "1F3C4 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏾‍♀️",
    "version": "E4.0",
    "description": "woman surfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄🏾‍♀",
    "version": "E4.0",
    "description": "woman surfing: medium-dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏄🏿‍♀️",
    "version": "E4.0",
    "description": "woman surfing: dark skin tone"
  },
  {
    "code_point": "1F3C4 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏄🏿‍♀",
    "version": "E4.0",
    "description": "woman surfing: dark skin tone"
  },
  {
    "code_point": "1F6A3",
    "status": "fully-qualified",
    "icon": "🚣",
    "version": "E1.0",
    "description": "person rowing boat"
  },
  {
    "code_point": "1F6A3 1F3FB",
    "status": "fully-qualified",
    "icon": "🚣🏻",
    "version": "E1.0",
    "description": "person rowing boat: light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FC",
    "status": "fully-qualified",
    "icon": "🚣🏼",
    "version": "E1.0",
    "description": "person rowing boat: medium-light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FD",
    "status": "fully-qualified",
    "icon": "🚣🏽",
    "version": "E1.0",
    "description": "person rowing boat: medium skin tone"
  },
  {
    "code_point": "1F6A3 1F3FE",
    "status": "fully-qualified",
    "icon": "🚣🏾",
    "version": "E1.0",
    "description": "person rowing boat: medium-dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FF",
    "status": "fully-qualified",
    "icon": "🚣🏿",
    "version": "E1.0",
    "description": "person rowing boat: dark skin tone"
  },
  {
    "code_point": "1F6A3 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣‍♂️",
    "version": "E4.0",
    "description": "man rowing boat"
  },
  {
    "code_point": "1F6A3 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣‍♂",
    "version": "E4.0",
    "description": "man rowing boat"
  },
  {
    "code_point": "1F6A3 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏻‍♂️",
    "version": "E4.0",
    "description": "man rowing boat: light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣🏻‍♂",
    "version": "E4.0",
    "description": "man rowing boat: light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏼‍♂️",
    "version": "E4.0",
    "description": "man rowing boat: medium-light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣🏼‍♂",
    "version": "E4.0",
    "description": "man rowing boat: medium-light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏽‍♂️",
    "version": "E4.0",
    "description": "man rowing boat: medium skin tone"
  },
  {
    "code_point": "1F6A3 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣🏽‍♂",
    "version": "E4.0",
    "description": "man rowing boat: medium skin tone"
  },
  {
    "code_point": "1F6A3 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏾‍♂️",
    "version": "E4.0",
    "description": "man rowing boat: medium-dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣🏾‍♂",
    "version": "E4.0",
    "description": "man rowing boat: medium-dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏿‍♂️",
    "version": "E4.0",
    "description": "man rowing boat: dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚣🏿‍♂",
    "version": "E4.0",
    "description": "man rowing boat: dark skin tone"
  },
  {
    "code_point": "1F6A3 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat"
  },
  {
    "code_point": "1F6A3 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣‍♀",
    "version": "E4.0",
    "description": "woman rowing boat"
  },
  {
    "code_point": "1F6A3 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏻‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat: light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣🏻‍♀",
    "version": "E4.0",
    "description": "woman rowing boat: light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏼‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat: medium-light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣🏼‍♀",
    "version": "E4.0",
    "description": "woman rowing boat: medium-light skin tone"
  },
  {
    "code_point": "1F6A3 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏽‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat: medium skin tone"
  },
  {
    "code_point": "1F6A3 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣🏽‍♀",
    "version": "E4.0",
    "description": "woman rowing boat: medium skin tone"
  },
  {
    "code_point": "1F6A3 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏾‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat: medium-dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣🏾‍♀",
    "version": "E4.0",
    "description": "woman rowing boat: medium-dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚣🏿‍♀️",
    "version": "E4.0",
    "description": "woman rowing boat: dark skin tone"
  },
  {
    "code_point": "1F6A3 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚣🏿‍♀",
    "version": "E4.0",
    "description": "woman rowing boat: dark skin tone"
  },
  {
    "code_point": "1F3CA",
    "status": "fully-qualified",
    "icon": "🏊",
    "version": "E0.6",
    "description": "person swimming"
  },
  {
    "code_point": "1F3CA 1F3FB",
    "status": "fully-qualified",
    "icon": "🏊🏻",
    "version": "E1.0",
    "description": "person swimming: light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FC",
    "status": "fully-qualified",
    "icon": "🏊🏼",
    "version": "E1.0",
    "description": "person swimming: medium-light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FD",
    "status": "fully-qualified",
    "icon": "🏊🏽",
    "version": "E1.0",
    "description": "person swimming: medium skin tone"
  },
  {
    "code_point": "1F3CA 1F3FE",
    "status": "fully-qualified",
    "icon": "🏊🏾",
    "version": "E1.0",
    "description": "person swimming: medium-dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FF",
    "status": "fully-qualified",
    "icon": "🏊🏿",
    "version": "E1.0",
    "description": "person swimming: dark skin tone"
  },
  {
    "code_point": "1F3CA 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊‍♂️",
    "version": "E4.0",
    "description": "man swimming"
  },
  {
    "code_point": "1F3CA 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊‍♂",
    "version": "E4.0",
    "description": "man swimming"
  },
  {
    "code_point": "1F3CA 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏻‍♂️",
    "version": "E4.0",
    "description": "man swimming: light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊🏻‍♂",
    "version": "E4.0",
    "description": "man swimming: light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏼‍♂️",
    "version": "E4.0",
    "description": "man swimming: medium-light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊🏼‍♂",
    "version": "E4.0",
    "description": "man swimming: medium-light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏽‍♂️",
    "version": "E4.0",
    "description": "man swimming: medium skin tone"
  },
  {
    "code_point": "1F3CA 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊🏽‍♂",
    "version": "E4.0",
    "description": "man swimming: medium skin tone"
  },
  {
    "code_point": "1F3CA 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏾‍♂️",
    "version": "E4.0",
    "description": "man swimming: medium-dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊🏾‍♂",
    "version": "E4.0",
    "description": "man swimming: medium-dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏿‍♂️",
    "version": "E4.0",
    "description": "man swimming: dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏊🏿‍♂",
    "version": "E4.0",
    "description": "man swimming: dark skin tone"
  },
  {
    "code_point": "1F3CA 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊‍♀️",
    "version": "E4.0",
    "description": "woman swimming"
  },
  {
    "code_point": "1F3CA 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊‍♀",
    "version": "E4.0",
    "description": "woman swimming"
  },
  {
    "code_point": "1F3CA 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏻‍♀️",
    "version": "E4.0",
    "description": "woman swimming: light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊🏻‍♀",
    "version": "E4.0",
    "description": "woman swimming: light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏼‍♀️",
    "version": "E4.0",
    "description": "woman swimming: medium-light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊🏼‍♀",
    "version": "E4.0",
    "description": "woman swimming: medium-light skin tone"
  },
  {
    "code_point": "1F3CA 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏽‍♀️",
    "version": "E4.0",
    "description": "woman swimming: medium skin tone"
  },
  {
    "code_point": "1F3CA 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊🏽‍♀",
    "version": "E4.0",
    "description": "woman swimming: medium skin tone"
  },
  {
    "code_point": "1F3CA 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏾‍♀️",
    "version": "E4.0",
    "description": "woman swimming: medium-dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊🏾‍♀",
    "version": "E4.0",
    "description": "woman swimming: medium-dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏊🏿‍♀️",
    "version": "E4.0",
    "description": "woman swimming: dark skin tone"
  },
  {
    "code_point": "1F3CA 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏊🏿‍♀",
    "version": "E4.0",
    "description": "woman swimming: dark skin tone"
  },
  {
    "code_point": "26F9 FE0F",
    "status": "fully-qualified",
    "icon": "⛹️",
    "version": "E0.7",
    "description": "person bouncing ball"
  },
  {
    "code_point": "26F9",
    "status": "unqualified",
    "icon": "⛹",
    "version": "E0.7",
    "description": "person bouncing ball"
  },
  {
    "code_point": "26F9 1F3FB",
    "status": "fully-qualified",
    "icon": "⛹🏻",
    "version": "E2.0",
    "description": "person bouncing ball: light skin tone"
  },
  {
    "code_point": "26F9 1F3FC",
    "status": "fully-qualified",
    "icon": "⛹🏼",
    "version": "E2.0",
    "description": "person bouncing ball: medium-light skin tone"
  },
  {
    "code_point": "26F9 1F3FD",
    "status": "fully-qualified",
    "icon": "⛹🏽",
    "version": "E2.0",
    "description": "person bouncing ball: medium skin tone"
  },
  {
    "code_point": "26F9 1F3FE",
    "status": "fully-qualified",
    "icon": "⛹🏾",
    "version": "E2.0",
    "description": "person bouncing ball: medium-dark skin tone"
  },
  {
    "code_point": "26F9 1F3FF",
    "status": "fully-qualified",
    "icon": "⛹🏿",
    "version": "E2.0",
    "description": "person bouncing ball: dark skin tone"
  },
  {
    "code_point": "26F9 FE0F 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹️‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball"
  },
  {
    "code_point": "26F9 200D 2642 FE0F",
    "status": "unqualified",
    "icon": "⛹‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball"
  },
  {
    "code_point": "26F9 FE0F 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹️‍♂",
    "version": "E4.0",
    "description": "man bouncing ball"
  },
  {
    "code_point": "26F9 200D 2642",
    "status": "unqualified",
    "icon": "⛹‍♂",
    "version": "E4.0",
    "description": "man bouncing ball"
  },
  {
    "code_point": "26F9 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏻‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball: light skin tone"
  },
  {
    "code_point": "26F9 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹🏻‍♂",
    "version": "E4.0",
    "description": "man bouncing ball: light skin tone"
  },
  {
    "code_point": "26F9 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏼‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball: medium-light skin tone"
  },
  {
    "code_point": "26F9 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹🏼‍♂",
    "version": "E4.0",
    "description": "man bouncing ball: medium-light skin tone"
  },
  {
    "code_point": "26F9 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏽‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball: medium skin tone"
  },
  {
    "code_point": "26F9 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹🏽‍♂",
    "version": "E4.0",
    "description": "man bouncing ball: medium skin tone"
  },
  {
    "code_point": "26F9 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏾‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball: medium-dark skin tone"
  },
  {
    "code_point": "26F9 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹🏾‍♂",
    "version": "E4.0",
    "description": "man bouncing ball: medium-dark skin tone"
  },
  {
    "code_point": "26F9 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏿‍♂️",
    "version": "E4.0",
    "description": "man bouncing ball: dark skin tone"
  },
  {
    "code_point": "26F9 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "⛹🏿‍♂",
    "version": "E4.0",
    "description": "man bouncing ball: dark skin tone"
  },
  {
    "code_point": "26F9 FE0F 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹️‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball"
  },
  {
    "code_point": "26F9 200D 2640 FE0F",
    "status": "unqualified",
    "icon": "⛹‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball"
  },
  {
    "code_point": "26F9 FE0F 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹️‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball"
  },
  {
    "code_point": "26F9 200D 2640",
    "status": "unqualified",
    "icon": "⛹‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball"
  },
  {
    "code_point": "26F9 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏻‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball: light skin tone"
  },
  {
    "code_point": "26F9 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹🏻‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball: light skin tone"
  },
  {
    "code_point": "26F9 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏼‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball: medium-light skin tone"
  },
  {
    "code_point": "26F9 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹🏼‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball: medium-light skin tone"
  },
  {
    "code_point": "26F9 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏽‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball: medium skin tone"
  },
  {
    "code_point": "26F9 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹🏽‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball: medium skin tone"
  },
  {
    "code_point": "26F9 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏾‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball: medium-dark skin tone"
  },
  {
    "code_point": "26F9 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹🏾‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball: medium-dark skin tone"
  },
  {
    "code_point": "26F9 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "⛹🏿‍♀️",
    "version": "E4.0",
    "description": "woman bouncing ball: dark skin tone"
  },
  {
    "code_point": "26F9 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "⛹🏿‍♀",
    "version": "E4.0",
    "description": "woman bouncing ball: dark skin tone"
  },
  {
    "code_point": "1F3CB FE0F",
    "status": "fully-qualified",
    "icon": "🏋️",
    "version": "E0.7",
    "description": "person lifting weights"
  },
  {
    "code_point": "1F3CB",
    "status": "unqualified",
    "icon": "🏋",
    "version": "E0.7",
    "description": "person lifting weights"
  },
  {
    "code_point": "1F3CB 1F3FB",
    "status": "fully-qualified",
    "icon": "🏋🏻",
    "version": "E2.0",
    "description": "person lifting weights: light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FC",
    "status": "fully-qualified",
    "icon": "🏋🏼",
    "version": "E2.0",
    "description": "person lifting weights: medium-light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FD",
    "status": "fully-qualified",
    "icon": "🏋🏽",
    "version": "E2.0",
    "description": "person lifting weights: medium skin tone"
  },
  {
    "code_point": "1F3CB 1F3FE",
    "status": "fully-qualified",
    "icon": "🏋🏾",
    "version": "E2.0",
    "description": "person lifting weights: medium-dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FF",
    "status": "fully-qualified",
    "icon": "🏋🏿",
    "version": "E2.0",
    "description": "person lifting weights: dark skin tone"
  },
  {
    "code_point": "1F3CB FE0F 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋️‍♂️",
    "version": "E4.0",
    "description": "man lifting weights"
  },
  {
    "code_point": "1F3CB 200D 2642 FE0F",
    "status": "unqualified",
    "icon": "🏋‍♂️",
    "version": "E4.0",
    "description": "man lifting weights"
  },
  {
    "code_point": "1F3CB FE0F 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋️‍♂",
    "version": "E4.0",
    "description": "man lifting weights"
  },
  {
    "code_point": "1F3CB 200D 2642",
    "status": "unqualified",
    "icon": "🏋‍♂",
    "version": "E4.0",
    "description": "man lifting weights"
  },
  {
    "code_point": "1F3CB 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏻‍♂️",
    "version": "E4.0",
    "description": "man lifting weights: light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋🏻‍♂",
    "version": "E4.0",
    "description": "man lifting weights: light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏼‍♂️",
    "version": "E4.0",
    "description": "man lifting weights: medium-light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋🏼‍♂",
    "version": "E4.0",
    "description": "man lifting weights: medium-light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏽‍♂️",
    "version": "E4.0",
    "description": "man lifting weights: medium skin tone"
  },
  {
    "code_point": "1F3CB 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋🏽‍♂",
    "version": "E4.0",
    "description": "man lifting weights: medium skin tone"
  },
  {
    "code_point": "1F3CB 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏾‍♂️",
    "version": "E4.0",
    "description": "man lifting weights: medium-dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋🏾‍♂",
    "version": "E4.0",
    "description": "man lifting weights: medium-dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏿‍♂️",
    "version": "E4.0",
    "description": "man lifting weights: dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🏋🏿‍♂",
    "version": "E4.0",
    "description": "man lifting weights: dark skin tone"
  },
  {
    "code_point": "1F3CB FE0F 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋️‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights"
  },
  {
    "code_point": "1F3CB 200D 2640 FE0F",
    "status": "unqualified",
    "icon": "🏋‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights"
  },
  {
    "code_point": "1F3CB FE0F 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋️‍♀",
    "version": "E4.0",
    "description": "woman lifting weights"
  },
  {
    "code_point": "1F3CB 200D 2640",
    "status": "unqualified",
    "icon": "🏋‍♀",
    "version": "E4.0",
    "description": "woman lifting weights"
  },
  {
    "code_point": "1F3CB 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏻‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights: light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋🏻‍♀",
    "version": "E4.0",
    "description": "woman lifting weights: light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏼‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights: medium-light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋🏼‍♀",
    "version": "E4.0",
    "description": "woman lifting weights: medium-light skin tone"
  },
  {
    "code_point": "1F3CB 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏽‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights: medium skin tone"
  },
  {
    "code_point": "1F3CB 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋🏽‍♀",
    "version": "E4.0",
    "description": "woman lifting weights: medium skin tone"
  },
  {
    "code_point": "1F3CB 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏾‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights: medium-dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋🏾‍♀",
    "version": "E4.0",
    "description": "woman lifting weights: medium-dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🏋🏿‍♀️",
    "version": "E4.0",
    "description": "woman lifting weights: dark skin tone"
  },
  {
    "code_point": "1F3CB 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🏋🏿‍♀",
    "version": "E4.0",
    "description": "woman lifting weights: dark skin tone"
  },
  {
    "code_point": "1F6B4",
    "status": "fully-qualified",
    "icon": "🚴",
    "version": "E1.0",
    "description": "person biking"
  },
  {
    "code_point": "1F6B4 1F3FB",
    "status": "fully-qualified",
    "icon": "🚴🏻",
    "version": "E1.0",
    "description": "person biking: light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FC",
    "status": "fully-qualified",
    "icon": "🚴🏼",
    "version": "E1.0",
    "description": "person biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FD",
    "status": "fully-qualified",
    "icon": "🚴🏽",
    "version": "E1.0",
    "description": "person biking: medium skin tone"
  },
  {
    "code_point": "1F6B4 1F3FE",
    "status": "fully-qualified",
    "icon": "🚴🏾",
    "version": "E1.0",
    "description": "person biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FF",
    "status": "fully-qualified",
    "icon": "🚴🏿",
    "version": "E1.0",
    "description": "person biking: dark skin tone"
  },
  {
    "code_point": "1F6B4 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴‍♂️",
    "version": "E4.0",
    "description": "man biking"
  },
  {
    "code_point": "1F6B4 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴‍♂",
    "version": "E4.0",
    "description": "man biking"
  },
  {
    "code_point": "1F6B4 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏻‍♂️",
    "version": "E4.0",
    "description": "man biking: light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴🏻‍♂",
    "version": "E4.0",
    "description": "man biking: light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏼‍♂️",
    "version": "E4.0",
    "description": "man biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴🏼‍♂",
    "version": "E4.0",
    "description": "man biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏽‍♂️",
    "version": "E4.0",
    "description": "man biking: medium skin tone"
  },
  {
    "code_point": "1F6B4 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴🏽‍♂",
    "version": "E4.0",
    "description": "man biking: medium skin tone"
  },
  {
    "code_point": "1F6B4 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏾‍♂️",
    "version": "E4.0",
    "description": "man biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴🏾‍♂",
    "version": "E4.0",
    "description": "man biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏿‍♂️",
    "version": "E4.0",
    "description": "man biking: dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚴🏿‍♂",
    "version": "E4.0",
    "description": "man biking: dark skin tone"
  },
  {
    "code_point": "1F6B4 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴‍♀️",
    "version": "E4.0",
    "description": "woman biking"
  },
  {
    "code_point": "1F6B4 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴‍♀",
    "version": "E4.0",
    "description": "woman biking"
  },
  {
    "code_point": "1F6B4 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏻‍♀️",
    "version": "E4.0",
    "description": "woman biking: light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴🏻‍♀",
    "version": "E4.0",
    "description": "woman biking: light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏼‍♀️",
    "version": "E4.0",
    "description": "woman biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴🏼‍♀",
    "version": "E4.0",
    "description": "woman biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B4 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏽‍♀️",
    "version": "E4.0",
    "description": "woman biking: medium skin tone"
  },
  {
    "code_point": "1F6B4 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴🏽‍♀",
    "version": "E4.0",
    "description": "woman biking: medium skin tone"
  },
  {
    "code_point": "1F6B4 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏾‍♀️",
    "version": "E4.0",
    "description": "woman biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴🏾‍♀",
    "version": "E4.0",
    "description": "woman biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚴🏿‍♀️",
    "version": "E4.0",
    "description": "woman biking: dark skin tone"
  },
  {
    "code_point": "1F6B4 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚴🏿‍♀",
    "version": "E4.0",
    "description": "woman biking: dark skin tone"
  },
  {
    "code_point": "1F6B5",
    "status": "fully-qualified",
    "icon": "🚵",
    "version": "E1.0",
    "description": "person mountain biking"
  },
  {
    "code_point": "1F6B5 1F3FB",
    "status": "fully-qualified",
    "icon": "🚵🏻",
    "version": "E1.0",
    "description": "person mountain biking: light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FC",
    "status": "fully-qualified",
    "icon": "🚵🏼",
    "version": "E1.0",
    "description": "person mountain biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FD",
    "status": "fully-qualified",
    "icon": "🚵🏽",
    "version": "E1.0",
    "description": "person mountain biking: medium skin tone"
  },
  {
    "code_point": "1F6B5 1F3FE",
    "status": "fully-qualified",
    "icon": "🚵🏾",
    "version": "E1.0",
    "description": "person mountain biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FF",
    "status": "fully-qualified",
    "icon": "🚵🏿",
    "version": "E1.0",
    "description": "person mountain biking: dark skin tone"
  },
  {
    "code_point": "1F6B5 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵‍♂️",
    "version": "E4.0",
    "description": "man mountain biking"
  },
  {
    "code_point": "1F6B5 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵‍♂",
    "version": "E4.0",
    "description": "man mountain biking"
  },
  {
    "code_point": "1F6B5 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏻‍♂️",
    "version": "E4.0",
    "description": "man mountain biking: light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵🏻‍♂",
    "version": "E4.0",
    "description": "man mountain biking: light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏼‍♂️",
    "version": "E4.0",
    "description": "man mountain biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵🏼‍♂",
    "version": "E4.0",
    "description": "man mountain biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏽‍♂️",
    "version": "E4.0",
    "description": "man mountain biking: medium skin tone"
  },
  {
    "code_point": "1F6B5 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵🏽‍♂",
    "version": "E4.0",
    "description": "man mountain biking: medium skin tone"
  },
  {
    "code_point": "1F6B5 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏾‍♂️",
    "version": "E4.0",
    "description": "man mountain biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵🏾‍♂",
    "version": "E4.0",
    "description": "man mountain biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏿‍♂️",
    "version": "E4.0",
    "description": "man mountain biking: dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🚵🏿‍♂",
    "version": "E4.0",
    "description": "man mountain biking: dark skin tone"
  },
  {
    "code_point": "1F6B5 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking"
  },
  {
    "code_point": "1F6B5 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵‍♀",
    "version": "E4.0",
    "description": "woman mountain biking"
  },
  {
    "code_point": "1F6B5 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏻‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking: light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵🏻‍♀",
    "version": "E4.0",
    "description": "woman mountain biking: light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏼‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵🏼‍♀",
    "version": "E4.0",
    "description": "woman mountain biking: medium-light skin tone"
  },
  {
    "code_point": "1F6B5 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏽‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking: medium skin tone"
  },
  {
    "code_point": "1F6B5 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵🏽‍♀",
    "version": "E4.0",
    "description": "woman mountain biking: medium skin tone"
  },
  {
    "code_point": "1F6B5 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏾‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵🏾‍♀",
    "version": "E4.0",
    "description": "woman mountain biking: medium-dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🚵🏿‍♀️",
    "version": "E4.0",
    "description": "woman mountain biking: dark skin tone"
  },
  {
    "code_point": "1F6B5 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🚵🏿‍♀",
    "version": "E4.0",
    "description": "woman mountain biking: dark skin tone"
  },
  {
    "code_point": "1F938",
    "status": "fully-qualified",
    "icon": "🤸",
    "version": "E3.0",
    "description": "person cartwheeling"
  },
  {
    "code_point": "1F938 1F3FB",
    "status": "fully-qualified",
    "icon": "🤸🏻",
    "version": "E3.0",
    "description": "person cartwheeling: light skin tone"
  },
  {
    "code_point": "1F938 1F3FC",
    "status": "fully-qualified",
    "icon": "🤸🏼",
    "version": "E3.0",
    "description": "person cartwheeling: medium-light skin tone"
  },
  {
    "code_point": "1F938 1F3FD",
    "status": "fully-qualified",
    "icon": "🤸🏽",
    "version": "E3.0",
    "description": "person cartwheeling: medium skin tone"
  },
  {
    "code_point": "1F938 1F3FE",
    "status": "fully-qualified",
    "icon": "🤸🏾",
    "version": "E3.0",
    "description": "person cartwheeling: medium-dark skin tone"
  },
  {
    "code_point": "1F938 1F3FF",
    "status": "fully-qualified",
    "icon": "🤸🏿",
    "version": "E3.0",
    "description": "person cartwheeling: dark skin tone"
  },
  {
    "code_point": "1F938 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling"
  },
  {
    "code_point": "1F938 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸‍♂",
    "version": "E4.0",
    "description": "man cartwheeling"
  },
  {
    "code_point": "1F938 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏻‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling: light skin tone"
  },
  {
    "code_point": "1F938 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸🏻‍♂",
    "version": "E4.0",
    "description": "man cartwheeling: light skin tone"
  },
  {
    "code_point": "1F938 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏼‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling: medium-light skin tone"
  },
  {
    "code_point": "1F938 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸🏼‍♂",
    "version": "E4.0",
    "description": "man cartwheeling: medium-light skin tone"
  },
  {
    "code_point": "1F938 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏽‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling: medium skin tone"
  },
  {
    "code_point": "1F938 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸🏽‍♂",
    "version": "E4.0",
    "description": "man cartwheeling: medium skin tone"
  },
  {
    "code_point": "1F938 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏾‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling: medium-dark skin tone"
  },
  {
    "code_point": "1F938 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸🏾‍♂",
    "version": "E4.0",
    "description": "man cartwheeling: medium-dark skin tone"
  },
  {
    "code_point": "1F938 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏿‍♂️",
    "version": "E4.0",
    "description": "man cartwheeling: dark skin tone"
  },
  {
    "code_point": "1F938 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤸🏿‍♂",
    "version": "E4.0",
    "description": "man cartwheeling: dark skin tone"
  },
  {
    "code_point": "1F938 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling"
  },
  {
    "code_point": "1F938 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling"
  },
  {
    "code_point": "1F938 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏻‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling: light skin tone"
  },
  {
    "code_point": "1F938 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸🏻‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling: light skin tone"
  },
  {
    "code_point": "1F938 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏼‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling: medium-light skin tone"
  },
  {
    "code_point": "1F938 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸🏼‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling: medium-light skin tone"
  },
  {
    "code_point": "1F938 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏽‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling: medium skin tone"
  },
  {
    "code_point": "1F938 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸🏽‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling: medium skin tone"
  },
  {
    "code_point": "1F938 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏾‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling: medium-dark skin tone"
  },
  {
    "code_point": "1F938 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸🏾‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling: medium-dark skin tone"
  },
  {
    "code_point": "1F938 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤸🏿‍♀️",
    "version": "E4.0",
    "description": "woman cartwheeling: dark skin tone"
  },
  {
    "code_point": "1F938 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤸🏿‍♀",
    "version": "E4.0",
    "description": "woman cartwheeling: dark skin tone"
  },
  {
    "code_point": "1F93C",
    "status": "fully-qualified",
    "icon": "🤼",
    "version": "E3.0",
    "description": "people wrestling"
  },
  {
    "code_point": "1F93C 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤼‍♂️",
    "version": "E4.0",
    "description": "men wrestling"
  },
  {
    "code_point": "1F93C 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤼‍♂",
    "version": "E4.0",
    "description": "men wrestling"
  },
  {
    "code_point": "1F93C 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤼‍♀️",
    "version": "E4.0",
    "description": "women wrestling"
  },
  {
    "code_point": "1F93C 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤼‍♀",
    "version": "E4.0",
    "description": "women wrestling"
  },
  {
    "code_point": "1F93D",
    "status": "fully-qualified",
    "icon": "🤽",
    "version": "E3.0",
    "description": "person playing water polo"
  },
  {
    "code_point": "1F93D 1F3FB",
    "status": "fully-qualified",
    "icon": "🤽🏻",
    "version": "E3.0",
    "description": "person playing water polo: light skin tone"
  },
  {
    "code_point": "1F93D 1F3FC",
    "status": "fully-qualified",
    "icon": "🤽🏼",
    "version": "E3.0",
    "description": "person playing water polo: medium-light skin tone"
  },
  {
    "code_point": "1F93D 1F3FD",
    "status": "fully-qualified",
    "icon": "🤽🏽",
    "version": "E3.0",
    "description": "person playing water polo: medium skin tone"
  },
  {
    "code_point": "1F93D 1F3FE",
    "status": "fully-qualified",
    "icon": "🤽🏾",
    "version": "E3.0",
    "description": "person playing water polo: medium-dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FF",
    "status": "fully-qualified",
    "icon": "🤽🏿",
    "version": "E3.0",
    "description": "person playing water polo: dark skin tone"
  },
  {
    "code_point": "1F93D 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽‍♂️",
    "version": "E4.0",
    "description": "man playing water polo"
  },
  {
    "code_point": "1F93D 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽‍♂",
    "version": "E4.0",
    "description": "man playing water polo"
  },
  {
    "code_point": "1F93D 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏻‍♂️",
    "version": "E4.0",
    "description": "man playing water polo: light skin tone"
  },
  {
    "code_point": "1F93D 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽🏻‍♂",
    "version": "E4.0",
    "description": "man playing water polo: light skin tone"
  },
  {
    "code_point": "1F93D 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏼‍♂️",
    "version": "E4.0",
    "description": "man playing water polo: medium-light skin tone"
  },
  {
    "code_point": "1F93D 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽🏼‍♂",
    "version": "E4.0",
    "description": "man playing water polo: medium-light skin tone"
  },
  {
    "code_point": "1F93D 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏽‍♂️",
    "version": "E4.0",
    "description": "man playing water polo: medium skin tone"
  },
  {
    "code_point": "1F93D 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽🏽‍♂",
    "version": "E4.0",
    "description": "man playing water polo: medium skin tone"
  },
  {
    "code_point": "1F93D 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏾‍♂️",
    "version": "E4.0",
    "description": "man playing water polo: medium-dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽🏾‍♂",
    "version": "E4.0",
    "description": "man playing water polo: medium-dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏿‍♂️",
    "version": "E4.0",
    "description": "man playing water polo: dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤽🏿‍♂",
    "version": "E4.0",
    "description": "man playing water polo: dark skin tone"
  },
  {
    "code_point": "1F93D 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo"
  },
  {
    "code_point": "1F93D 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽‍♀",
    "version": "E4.0",
    "description": "woman playing water polo"
  },
  {
    "code_point": "1F93D 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏻‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo: light skin tone"
  },
  {
    "code_point": "1F93D 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽🏻‍♀",
    "version": "E4.0",
    "description": "woman playing water polo: light skin tone"
  },
  {
    "code_point": "1F93D 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏼‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo: medium-light skin tone"
  },
  {
    "code_point": "1F93D 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽🏼‍♀",
    "version": "E4.0",
    "description": "woman playing water polo: medium-light skin tone"
  },
  {
    "code_point": "1F93D 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏽‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo: medium skin tone"
  },
  {
    "code_point": "1F93D 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽🏽‍♀",
    "version": "E4.0",
    "description": "woman playing water polo: medium skin tone"
  },
  {
    "code_point": "1F93D 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏾‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo: medium-dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽🏾‍♀",
    "version": "E4.0",
    "description": "woman playing water polo: medium-dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤽🏿‍♀️",
    "version": "E4.0",
    "description": "woman playing water polo: dark skin tone"
  },
  {
    "code_point": "1F93D 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤽🏿‍♀",
    "version": "E4.0",
    "description": "woman playing water polo: dark skin tone"
  },
  {
    "code_point": "1F93E",
    "status": "fully-qualified",
    "icon": "🤾",
    "version": "E3.0",
    "description": "person playing handball"
  },
  {
    "code_point": "1F93E 1F3FB",
    "status": "fully-qualified",
    "icon": "🤾🏻",
    "version": "E3.0",
    "description": "person playing handball: light skin tone"
  },
  {
    "code_point": "1F93E 1F3FC",
    "status": "fully-qualified",
    "icon": "🤾🏼",
    "version": "E3.0",
    "description": "person playing handball: medium-light skin tone"
  },
  {
    "code_point": "1F93E 1F3FD",
    "status": "fully-qualified",
    "icon": "🤾🏽",
    "version": "E3.0",
    "description": "person playing handball: medium skin tone"
  },
  {
    "code_point": "1F93E 1F3FE",
    "status": "fully-qualified",
    "icon": "🤾🏾",
    "version": "E3.0",
    "description": "person playing handball: medium-dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FF",
    "status": "fully-qualified",
    "icon": "🤾🏿",
    "version": "E3.0",
    "description": "person playing handball: dark skin tone"
  },
  {
    "code_point": "1F93E 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾‍♂️",
    "version": "E4.0",
    "description": "man playing handball"
  },
  {
    "code_point": "1F93E 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾‍♂",
    "version": "E4.0",
    "description": "man playing handball"
  },
  {
    "code_point": "1F93E 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏻‍♂️",
    "version": "E4.0",
    "description": "man playing handball: light skin tone"
  },
  {
    "code_point": "1F93E 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾🏻‍♂",
    "version": "E4.0",
    "description": "man playing handball: light skin tone"
  },
  {
    "code_point": "1F93E 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏼‍♂️",
    "version": "E4.0",
    "description": "man playing handball: medium-light skin tone"
  },
  {
    "code_point": "1F93E 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾🏼‍♂",
    "version": "E4.0",
    "description": "man playing handball: medium-light skin tone"
  },
  {
    "code_point": "1F93E 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏽‍♂️",
    "version": "E4.0",
    "description": "man playing handball: medium skin tone"
  },
  {
    "code_point": "1F93E 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾🏽‍♂",
    "version": "E4.0",
    "description": "man playing handball: medium skin tone"
  },
  {
    "code_point": "1F93E 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏾‍♂️",
    "version": "E4.0",
    "description": "man playing handball: medium-dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾🏾‍♂",
    "version": "E4.0",
    "description": "man playing handball: medium-dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏿‍♂️",
    "version": "E4.0",
    "description": "man playing handball: dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤾🏿‍♂",
    "version": "E4.0",
    "description": "man playing handball: dark skin tone"
  },
  {
    "code_point": "1F93E 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾‍♀️",
    "version": "E4.0",
    "description": "woman playing handball"
  },
  {
    "code_point": "1F93E 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾‍♀",
    "version": "E4.0",
    "description": "woman playing handball"
  },
  {
    "code_point": "1F93E 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏻‍♀️",
    "version": "E4.0",
    "description": "woman playing handball: light skin tone"
  },
  {
    "code_point": "1F93E 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾🏻‍♀",
    "version": "E4.0",
    "description": "woman playing handball: light skin tone"
  },
  {
    "code_point": "1F93E 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏼‍♀️",
    "version": "E4.0",
    "description": "woman playing handball: medium-light skin tone"
  },
  {
    "code_point": "1F93E 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾🏼‍♀",
    "version": "E4.0",
    "description": "woman playing handball: medium-light skin tone"
  },
  {
    "code_point": "1F93E 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏽‍♀️",
    "version": "E4.0",
    "description": "woman playing handball: medium skin tone"
  },
  {
    "code_point": "1F93E 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾🏽‍♀",
    "version": "E4.0",
    "description": "woman playing handball: medium skin tone"
  },
  {
    "code_point": "1F93E 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏾‍♀️",
    "version": "E4.0",
    "description": "woman playing handball: medium-dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾🏾‍♀",
    "version": "E4.0",
    "description": "woman playing handball: medium-dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤾🏿‍♀️",
    "version": "E4.0",
    "description": "woman playing handball: dark skin tone"
  },
  {
    "code_point": "1F93E 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤾🏿‍♀",
    "version": "E4.0",
    "description": "woman playing handball: dark skin tone"
  },
  {
    "code_point": "1F939",
    "status": "fully-qualified",
    "icon": "🤹",
    "version": "E3.0",
    "description": "person juggling"
  },
  {
    "code_point": "1F939 1F3FB",
    "status": "fully-qualified",
    "icon": "🤹🏻",
    "version": "E3.0",
    "description": "person juggling: light skin tone"
  },
  {
    "code_point": "1F939 1F3FC",
    "status": "fully-qualified",
    "icon": "🤹🏼",
    "version": "E3.0",
    "description": "person juggling: medium-light skin tone"
  },
  {
    "code_point": "1F939 1F3FD",
    "status": "fully-qualified",
    "icon": "🤹🏽",
    "version": "E3.0",
    "description": "person juggling: medium skin tone"
  },
  {
    "code_point": "1F939 1F3FE",
    "status": "fully-qualified",
    "icon": "🤹🏾",
    "version": "E3.0",
    "description": "person juggling: medium-dark skin tone"
  },
  {
    "code_point": "1F939 1F3FF",
    "status": "fully-qualified",
    "icon": "🤹🏿",
    "version": "E3.0",
    "description": "person juggling: dark skin tone"
  },
  {
    "code_point": "1F939 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹‍♂️",
    "version": "E4.0",
    "description": "man juggling"
  },
  {
    "code_point": "1F939 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹‍♂",
    "version": "E4.0",
    "description": "man juggling"
  },
  {
    "code_point": "1F939 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏻‍♂️",
    "version": "E4.0",
    "description": "man juggling: light skin tone"
  },
  {
    "code_point": "1F939 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹🏻‍♂",
    "version": "E4.0",
    "description": "man juggling: light skin tone"
  },
  {
    "code_point": "1F939 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏼‍♂️",
    "version": "E4.0",
    "description": "man juggling: medium-light skin tone"
  },
  {
    "code_point": "1F939 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹🏼‍♂",
    "version": "E4.0",
    "description": "man juggling: medium-light skin tone"
  },
  {
    "code_point": "1F939 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏽‍♂️",
    "version": "E4.0",
    "description": "man juggling: medium skin tone"
  },
  {
    "code_point": "1F939 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹🏽‍♂",
    "version": "E4.0",
    "description": "man juggling: medium skin tone"
  },
  {
    "code_point": "1F939 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏾‍♂️",
    "version": "E4.0",
    "description": "man juggling: medium-dark skin tone"
  },
  {
    "code_point": "1F939 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹🏾‍♂",
    "version": "E4.0",
    "description": "man juggling: medium-dark skin tone"
  },
  {
    "code_point": "1F939 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏿‍♂️",
    "version": "E4.0",
    "description": "man juggling: dark skin tone"
  },
  {
    "code_point": "1F939 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🤹🏿‍♂",
    "version": "E4.0",
    "description": "man juggling: dark skin tone"
  },
  {
    "code_point": "1F939 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹‍♀️",
    "version": "E4.0",
    "description": "woman juggling"
  },
  {
    "code_point": "1F939 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹‍♀",
    "version": "E4.0",
    "description": "woman juggling"
  },
  {
    "code_point": "1F939 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏻‍♀️",
    "version": "E4.0",
    "description": "woman juggling: light skin tone"
  },
  {
    "code_point": "1F939 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹🏻‍♀",
    "version": "E4.0",
    "description": "woman juggling: light skin tone"
  },
  {
    "code_point": "1F939 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏼‍♀️",
    "version": "E4.0",
    "description": "woman juggling: medium-light skin tone"
  },
  {
    "code_point": "1F939 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹🏼‍♀",
    "version": "E4.0",
    "description": "woman juggling: medium-light skin tone"
  },
  {
    "code_point": "1F939 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏽‍♀️",
    "version": "E4.0",
    "description": "woman juggling: medium skin tone"
  },
  {
    "code_point": "1F939 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹🏽‍♀",
    "version": "E4.0",
    "description": "woman juggling: medium skin tone"
  },
  {
    "code_point": "1F939 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏾‍♀️",
    "version": "E4.0",
    "description": "woman juggling: medium-dark skin tone"
  },
  {
    "code_point": "1F939 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹🏾‍♀",
    "version": "E4.0",
    "description": "woman juggling: medium-dark skin tone"
  },
  {
    "code_point": "1F939 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🤹🏿‍♀️",
    "version": "E4.0",
    "description": "woman juggling: dark skin tone"
  },
  {
    "code_point": "1F939 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🤹🏿‍♀",
    "version": "E4.0",
    "description": "woman juggling: dark skin tone"
  },
  {
    "code_point": "1F9D8",
    "status": "fully-qualified",
    "icon": "🧘",
    "version": "E5.0",
    "description": "person in lotus position"
  },
  {
    "code_point": "1F9D8 1F3FB",
    "status": "fully-qualified",
    "icon": "🧘🏻",
    "version": "E5.0",
    "description": "person in lotus position: light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FC",
    "status": "fully-qualified",
    "icon": "🧘🏼",
    "version": "E5.0",
    "description": "person in lotus position: medium-light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FD",
    "status": "fully-qualified",
    "icon": "🧘🏽",
    "version": "E5.0",
    "description": "person in lotus position: medium skin tone"
  },
  {
    "code_point": "1F9D8 1F3FE",
    "status": "fully-qualified",
    "icon": "🧘🏾",
    "version": "E5.0",
    "description": "person in lotus position: medium-dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FF",
    "status": "fully-qualified",
    "icon": "🧘🏿",
    "version": "E5.0",
    "description": "person in lotus position: dark skin tone"
  },
  {
    "code_point": "1F9D8 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘‍♂️",
    "version": "E5.0",
    "description": "man in lotus position"
  },
  {
    "code_point": "1F9D8 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘‍♂",
    "version": "E5.0",
    "description": "man in lotus position"
  },
  {
    "code_point": "1F9D8 1F3FB 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏻‍♂️",
    "version": "E5.0",
    "description": "man in lotus position: light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FB 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘🏻‍♂",
    "version": "E5.0",
    "description": "man in lotus position: light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FC 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏼‍♂️",
    "version": "E5.0",
    "description": "man in lotus position: medium-light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FC 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘🏼‍♂",
    "version": "E5.0",
    "description": "man in lotus position: medium-light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FD 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏽‍♂️",
    "version": "E5.0",
    "description": "man in lotus position: medium skin tone"
  },
  {
    "code_point": "1F9D8 1F3FD 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘🏽‍♂",
    "version": "E5.0",
    "description": "man in lotus position: medium skin tone"
  },
  {
    "code_point": "1F9D8 1F3FE 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏾‍♂️",
    "version": "E5.0",
    "description": "man in lotus position: medium-dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FE 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘🏾‍♂",
    "version": "E5.0",
    "description": "man in lotus position: medium-dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FF 200D 2642 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏿‍♂️",
    "version": "E5.0",
    "description": "man in lotus position: dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FF 200D 2642",
    "status": "minimally-qualified",
    "icon": "🧘🏿‍♂",
    "version": "E5.0",
    "description": "man in lotus position: dark skin tone"
  },
  {
    "code_point": "1F9D8 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position"
  },
  {
    "code_point": "1F9D8 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘‍♀",
    "version": "E5.0",
    "description": "woman in lotus position"
  },
  {
    "code_point": "1F9D8 1F3FB 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏻‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position: light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FB 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘🏻‍♀",
    "version": "E5.0",
    "description": "woman in lotus position: light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FC 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏼‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position: medium-light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FC 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘🏼‍♀",
    "version": "E5.0",
    "description": "woman in lotus position: medium-light skin tone"
  },
  {
    "code_point": "1F9D8 1F3FD 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏽‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position: medium skin tone"
  },
  {
    "code_point": "1F9D8 1F3FD 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘🏽‍♀",
    "version": "E5.0",
    "description": "woman in lotus position: medium skin tone"
  },
  {
    "code_point": "1F9D8 1F3FE 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏾‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position: medium-dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FE 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘🏾‍♀",
    "version": "E5.0",
    "description": "woman in lotus position: medium-dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FF 200D 2640 FE0F",
    "status": "fully-qualified",
    "icon": "🧘🏿‍♀️",
    "version": "E5.0",
    "description": "woman in lotus position: dark skin tone"
  },
  {
    "code_point": "1F9D8 1F3FF 200D 2640",
    "status": "minimally-qualified",
    "icon": "🧘🏿‍♀",
    "version": "E5.0",
    "description": "woman in lotus position: dark skin tone"
  },
  {
    "code_point": "1F6C0",
    "status": "fully-qualified",
    "icon": "🛀",
    "version": "E0.6",
    "description": "person taking bath"
  },
  {
    "code_point": "1F6C0 1F3FB",
    "status": "fully-qualified",
    "icon": "🛀🏻",
    "version": "E1.0",
    "description": "person taking bath: light skin tone"
  },
  {
    "code_point": "1F6C0 1F3FC",
    "status": "fully-qualified",
    "icon": "🛀🏼",
    "version": "E1.0",
    "description": "person taking bath: medium-light skin tone"
  },
  {
    "code_point": "1F6C0 1F3FD",
    "status": "fully-qualified",
    "icon": "🛀🏽",
    "version": "E1.0",
    "description": "person taking bath: medium skin tone"
  },
  {
    "code_point": "1F6C0 1F3FE",
    "status": "fully-qualified",
    "icon": "🛀🏾",
    "version": "E1.0",
    "description": "person taking bath: medium-dark skin tone"
  },
  {
    "code_point": "1F6C0 1F3FF",
    "status": "fully-qualified",
    "icon": "🛀🏿",
    "version": "E1.0",
    "description": "person taking bath: dark skin tone"
  },
  {
    "code_point": "1F6CC",
    "status": "fully-qualified",
    "icon": "🛌",
    "version": "E1.0",
    "description": "person in bed"
  },
  {
    "code_point": "1F6CC 1F3FB",
    "status": "fully-qualified",
    "icon": "🛌🏻",
    "version": "E4.0",
    "description": "person in bed: light skin tone"
  },
  {
    "code_point": "1F6CC 1F3FC",
    "status": "fully-qualified",
    "icon": "🛌🏼",
    "version": "E4.0",
    "description": "person in bed: medium-light skin tone"
  },
  {
    "code_point": "1F6CC 1F3FD",
    "status": "fully-qualified",
    "icon": "🛌🏽",
    "version": "E4.0",
    "description": "person in bed: medium skin tone"
  },
  {
    "code_point": "1F6CC 1F3FE",
    "status": "fully-qualified",
    "icon": "🛌🏾",
    "version": "E4.0",
    "description": "person in bed: medium-dark skin tone"
  },
  {
    "code_point": "1F6CC 1F3FF",
    "status": "fully-qualified",
    "icon": "🛌🏿",
    "version": "E4.0",
    "description": "person in bed: dark skin tone"
  },
  {
    "code_point": "1F9D1 200D 1F91D 200D 1F9D1",
    "status": "fully-qualified",
    "icon": "🧑‍🤝‍🧑",
    "version": "E12.0",
    "description": "people holding hands"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F91D 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🤝‍🧑🏻",
    "version": "E12.0",
    "description": "people holding hands: light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F91D 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🤝‍🧑🏼",
    "version": "E12.1",
    "description": "people holding hands: light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F91D 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🤝‍🧑🏽",
    "version": "E12.1",
    "description": "people holding hands: light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F91D 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🤝‍🧑🏾",
    "version": "E12.1",
    "description": "people holding hands: light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 1F91D 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏻‍🤝‍🧑🏿",
    "version": "E12.1",
    "description": "people holding hands: light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F91D 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🤝‍🧑🏻",
    "version": "E12.0",
    "description": "people holding hands: medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F91D 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🤝‍🧑🏼",
    "version": "E12.0",
    "description": "people holding hands: medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F91D 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🤝‍🧑🏽",
    "version": "E12.1",
    "description": "people holding hands: medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F91D 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🤝‍🧑🏾",
    "version": "E12.1",
    "description": "people holding hands: medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 1F91D 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏼‍🤝‍🧑🏿",
    "version": "E12.1",
    "description": "people holding hands: medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F91D 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🤝‍🧑🏻",
    "version": "E12.0",
    "description": "people holding hands: medium skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F91D 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🤝‍🧑🏼",
    "version": "E12.0",
    "description": "people holding hands: medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F91D 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🤝‍🧑🏽",
    "version": "E12.0",
    "description": "people holding hands: medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F91D 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🤝‍🧑🏾",
    "version": "E12.1",
    "description": "people holding hands: medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 1F91D 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏽‍🤝‍🧑🏿",
    "version": "E12.1",
    "description": "people holding hands: medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🤝‍🧑🏻",
    "version": "E12.0",
    "description": "people holding hands: medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🤝‍🧑🏼",
    "version": "E12.0",
    "description": "people holding hands: medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🤝‍🧑🏽",
    "version": "E12.0",
    "description": "people holding hands: medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🤝‍🧑🏾",
    "version": "E12.0",
    "description": "people holding hands: medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 1F91D 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏾‍🤝‍🧑🏿",
    "version": "E12.1",
    "description": "people holding hands: medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F91D 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🤝‍🧑🏻",
    "version": "E12.0",
    "description": "people holding hands: dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F91D 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🤝‍🧑🏼",
    "version": "E12.0",
    "description": "people holding hands: dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F91D 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🤝‍🧑🏽",
    "version": "E12.0",
    "description": "people holding hands: dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F91D 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🤝‍🧑🏾",
    "version": "E12.0",
    "description": "people holding hands: dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 1F91D 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏿‍🤝‍🧑🏿",
    "version": "E12.0",
    "description": "people holding hands: dark skin tone"
  },
  {
    "code_point": "1F46D",
    "status": "fully-qualified",
    "icon": "👭",
    "version": "E1.0",
    "description": "women holding hands"
  },
  {
    "code_point": "1F46D 1F3FB",
    "status": "fully-qualified",
    "icon": "👭🏻",
    "version": "E12.0",
    "description": "women holding hands: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👩🏼",
    "version": "E12.1",
    "description": "women holding hands: light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👩🏽",
    "version": "E12.1",
    "description": "women holding hands: light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👩🏾",
    "version": "E12.1",
    "description": "women holding hands: light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👩🏿",
    "version": "E12.1",
    "description": "women holding hands: light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👩🏻",
    "version": "E12.0",
    "description": "women holding hands: medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F46D 1F3FC",
    "status": "fully-qualified",
    "icon": "👭🏼",
    "version": "E12.0",
    "description": "women holding hands: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👩🏽",
    "version": "E12.1",
    "description": "women holding hands: medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👩🏾",
    "version": "E12.1",
    "description": "women holding hands: medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👩🏿",
    "version": "E12.1",
    "description": "women holding hands: medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👩🏻",
    "version": "E12.0",
    "description": "women holding hands: medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👩🏼",
    "version": "E12.0",
    "description": "women holding hands: medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F46D 1F3FD",
    "status": "fully-qualified",
    "icon": "👭🏽",
    "version": "E12.0",
    "description": "women holding hands: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👩🏾",
    "version": "E12.1",
    "description": "women holding hands: medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👩🏿",
    "version": "E12.1",
    "description": "women holding hands: medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👩🏻",
    "version": "E12.0",
    "description": "women holding hands: medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👩🏼",
    "version": "E12.0",
    "description": "women holding hands: medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👩🏽",
    "version": "E12.0",
    "description": "women holding hands: medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F46D 1F3FE",
    "status": "fully-qualified",
    "icon": "👭🏾",
    "version": "E12.0",
    "description": "women holding hands: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👩🏿",
    "version": "E12.1",
    "description": "women holding hands: medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👩🏻",
    "version": "E12.0",
    "description": "women holding hands: dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👩🏼",
    "version": "E12.0",
    "description": "women holding hands: dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👩🏽",
    "version": "E12.0",
    "description": "women holding hands: dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👩🏾",
    "version": "E12.0",
    "description": "women holding hands: dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F46D 1F3FF",
    "status": "fully-qualified",
    "icon": "👭🏿",
    "version": "E12.0",
    "description": "women holding hands: dark skin tone"
  },
  {
    "code_point": "1F46B",
    "status": "fully-qualified",
    "icon": "👫",
    "version": "E0.6",
    "description": "woman and man holding hands"
  },
  {
    "code_point": "1F46B 1F3FB",
    "status": "fully-qualified",
    "icon": "👫🏻",
    "version": "E12.0",
    "description": "woman and man holding hands: light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "woman and man holding hands: light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "woman and man holding hands: light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👨🏾",
    "version": "E12.0",
    "description": "woman and man holding hands: light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍🤝‍👨🏿",
    "version": "E12.0",
    "description": "woman and man holding hands: light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F46B 1F3FC",
    "status": "fully-qualified",
    "icon": "👫🏼",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👨🏾",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍🤝‍👨🏿",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "woman and man holding hands: medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "woman and man holding hands: medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F46B 1F3FD",
    "status": "fully-qualified",
    "icon": "👫🏽",
    "version": "E12.0",
    "description": "woman and man holding hands: medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👨🏾",
    "version": "E12.0",
    "description": "woman and man holding hands: medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍🤝‍👨🏿",
    "version": "E12.0",
    "description": "woman and man holding hands: medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F46B 1F3FE",
    "status": "fully-qualified",
    "icon": "👫🏾",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍🤝‍👨🏿",
    "version": "E12.0",
    "description": "woman and man holding hands: medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "woman and man holding hands: dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "woman and man holding hands: dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "woman and man holding hands: dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍🤝‍👨🏾",
    "version": "E12.0",
    "description": "woman and man holding hands: dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F46B 1F3FF",
    "status": "fully-qualified",
    "icon": "👫🏿",
    "version": "E12.0",
    "description": "woman and man holding hands: dark skin tone"
  },
  {
    "code_point": "1F46C",
    "status": "fully-qualified",
    "icon": "👬",
    "version": "E1.0",
    "description": "men holding hands"
  },
  {
    "code_point": "1F46C 1F3FB",
    "status": "fully-qualified",
    "icon": "👬🏻",
    "version": "E12.0",
    "description": "men holding hands: light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏻‍🤝‍👨🏼",
    "version": "E12.1",
    "description": "men holding hands: light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏻‍🤝‍👨🏽",
    "version": "E12.1",
    "description": "men holding hands: light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏻‍🤝‍👨🏾",
    "version": "E12.1",
    "description": "men holding hands: light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏻‍🤝‍👨🏿",
    "version": "E12.1",
    "description": "men holding hands: light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏼‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "men holding hands: medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F46C 1F3FC",
    "status": "fully-qualified",
    "icon": "👬🏼",
    "version": "E12.0",
    "description": "men holding hands: medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏼‍🤝‍👨🏽",
    "version": "E12.1",
    "description": "men holding hands: medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏼‍🤝‍👨🏾",
    "version": "E12.1",
    "description": "men holding hands: medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏼‍🤝‍👨🏿",
    "version": "E12.1",
    "description": "men holding hands: medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏽‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "men holding hands: medium skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏽‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "men holding hands: medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F46C 1F3FD",
    "status": "fully-qualified",
    "icon": "👬🏽",
    "version": "E12.0",
    "description": "men holding hands: medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏽‍🤝‍👨🏾",
    "version": "E12.1",
    "description": "men holding hands: medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏽‍🤝‍👨🏿",
    "version": "E12.1",
    "description": "men holding hands: medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏾‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "men holding hands: medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏾‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "men holding hands: medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏾‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "men holding hands: medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F46C 1F3FE",
    "status": "fully-qualified",
    "icon": "👬🏾",
    "version": "E12.0",
    "description": "men holding hands: medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 1F91D 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏾‍🤝‍👨🏿",
    "version": "E12.1",
    "description": "men holding hands: medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F91D 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏿‍🤝‍👨🏻",
    "version": "E12.0",
    "description": "men holding hands: dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F91D 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏿‍🤝‍👨🏼",
    "version": "E12.0",
    "description": "men holding hands: dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F91D 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏿‍🤝‍👨🏽",
    "version": "E12.0",
    "description": "men holding hands: dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 1F91D 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏿‍🤝‍👨🏾",
    "version": "E12.0",
    "description": "men holding hands: dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F46C 1F3FF",
    "status": "fully-qualified",
    "icon": "👬🏿",
    "version": "E12.0",
    "description": "men holding hands: dark skin tone"
  },
  {
    "code_point": "1F48F",
    "status": "fully-qualified",
    "icon": "💏",
    "version": "E0.6",
    "description": "kiss"
  },
  {
    "code_point": "1F48F 1F3FB",
    "status": "fully-qualified",
    "icon": "💏🏻",
    "version": "E13.1",
    "description": "kiss: light skin tone"
  },
  {
    "code_point": "1F48F 1F3FC",
    "status": "fully-qualified",
    "icon": "💏🏼",
    "version": "E13.1",
    "description": "kiss: medium-light skin tone"
  },
  {
    "code_point": "1F48F 1F3FD",
    "status": "fully-qualified",
    "icon": "💏🏽",
    "version": "E13.1",
    "description": "kiss: medium skin tone"
  },
  {
    "code_point": "1F48F 1F3FE",
    "status": "fully-qualified",
    "icon": "💏🏾",
    "version": "E13.1",
    "description": "kiss: medium-dark skin tone"
  },
  {
    "code_point": "1F48F 1F3FF",
    "status": "fully-qualified",
    "icon": "💏🏿",
    "version": "E13.1",
    "description": "kiss: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F48B 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍💋‍🧑🏿",
    "version": "E13.1",
    "description": "kiss: person, person, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F48B 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍💋‍🧑🏻",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F48B 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍💋‍🧑🏼",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F48B 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍💋‍🧑🏽",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F48B 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍💋‍🧑🏾",
    "version": "E13.1",
    "description": "kiss: person, person, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 200D 2764 FE0F 200D 1F48B 200D 1F468",
    "status": "fully-qualified",
    "icon": "👩‍❤️‍💋‍👨",
    "version": "E2.0",
    "description": "kiss: woman, man"
  },
  {
    "code_point": "1F469 200D 2764 200D 1F48B 200D 1F468",
    "status": "minimally-qualified",
    "icon": "👩‍❤‍💋‍👨",
    "version": "E2.0",
    "description": "kiss: woman, man"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: woman, man, dark skin tone"
  },
  {
    "code_point": "1F468 200D 2764 FE0F 200D 1F48B 200D 1F468",
    "status": "fully-qualified",
    "icon": "👨‍❤️‍💋‍👨",
    "version": "E2.0",
    "description": "kiss: man, man"
  },
  {
    "code_point": "1F468 200D 2764 200D 1F48B 200D 1F468",
    "status": "minimally-qualified",
    "icon": "👨‍❤‍💋‍👨",
    "version": "E2.0",
    "description": "kiss: man, man"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍💋‍👨🏻",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍💋‍👨🏼",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍💋‍👨🏽",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍💋‍👨🏾",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F48B 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍💋‍👨🏿",
    "version": "E13.1",
    "description": "kiss: man, man, dark skin tone"
  },
  {
    "code_point": "1F469 200D 2764 FE0F 200D 1F48B 200D 1F469",
    "status": "fully-qualified",
    "icon": "👩‍❤️‍💋‍👩",
    "version": "E2.0",
    "description": "kiss: woman, woman"
  },
  {
    "code_point": "1F469 200D 2764 200D 1F48B 200D 1F469",
    "status": "minimally-qualified",
    "icon": "👩‍❤‍💋‍👩",
    "version": "E2.0",
    "description": "kiss: woman, woman"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F48B 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F48B 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F48B 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F48B 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👩🏻",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👩🏼",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👩🏽",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👩🏾",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F48B 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F48B 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍💋‍👩🏿",
    "version": "E13.1",
    "description": "kiss: woman, woman, dark skin tone"
  },
  {
    "code_point": "1F491",
    "status": "fully-qualified",
    "icon": "💑",
    "version": "E0.6",
    "description": "couple with heart"
  },
  {
    "code_point": "1F491 1F3FB",
    "status": "fully-qualified",
    "icon": "💑🏻",
    "version": "E13.1",
    "description": "couple with heart: light skin tone"
  },
  {
    "code_point": "1F491 1F3FC",
    "status": "fully-qualified",
    "icon": "💑🏼",
    "version": "E13.1",
    "description": "couple with heart: medium-light skin tone"
  },
  {
    "code_point": "1F491 1F3FD",
    "status": "fully-qualified",
    "icon": "💑🏽",
    "version": "E13.1",
    "description": "couple with heart: medium skin tone"
  },
  {
    "code_point": "1F491 1F3FE",
    "status": "fully-qualified",
    "icon": "💑🏾",
    "version": "E13.1",
    "description": "couple with heart: medium-dark skin tone"
  },
  {
    "code_point": "1F491 1F3FF",
    "status": "fully-qualified",
    "icon": "💑🏿",
    "version": "E13.1",
    "description": "couple with heart: dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 FE0F 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏻‍❤️‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FB 200D 2764 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏻‍❤‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 FE0F 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏼‍❤️‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FC 200D 2764 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏼‍❤‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 FE0F 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏽‍❤️‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FD 200D 2764 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏽‍❤‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 FE0F 200D 1F9D1 1F3FF",
    "status": "fully-qualified",
    "icon": "🧑🏾‍❤️‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FE 200D 2764 200D 1F9D1 1F3FF",
    "status": "minimally-qualified",
    "icon": "🧑🏾‍❤‍🧑🏿",
    "version": "E13.1",
    "description": "couple with heart: person, person, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F9D1 1F3FB",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F9D1 1F3FB",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍🧑🏻",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F9D1 1F3FC",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F9D1 1F3FC",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍🧑🏼",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F9D1 1F3FD",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F9D1 1F3FD",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍🧑🏽",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 FE0F 200D 1F9D1 1F3FE",
    "status": "fully-qualified",
    "icon": "🧑🏿‍❤️‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F9D1 1F3FF 200D 2764 200D 1F9D1 1F3FE",
    "status": "minimally-qualified",
    "icon": "🧑🏿‍❤‍🧑🏾",
    "version": "E13.1",
    "description": "couple with heart: person, person, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 200D 2764 FE0F 200D 1F468",
    "status": "fully-qualified",
    "icon": "👩‍❤️‍👨",
    "version": "E2.0",
    "description": "couple with heart: woman, man"
  },
  {
    "code_point": "1F469 200D 2764 200D 1F468",
    "status": "minimally-qualified",
    "icon": "👩‍❤‍👨",
    "version": "E2.0",
    "description": "couple with heart: woman, man"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, man, dark skin tone"
  },
  {
    "code_point": "1F468 200D 2764 FE0F 200D 1F468",
    "status": "fully-qualified",
    "icon": "👨‍❤️‍👨",
    "version": "E2.0",
    "description": "couple with heart: man, man"
  },
  {
    "code_point": "1F468 200D 2764 200D 1F468",
    "status": "minimally-qualified",
    "icon": "👨‍❤‍👨",
    "version": "E2.0",
    "description": "couple with heart: man, man"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏻‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FB 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏻‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏼‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FC 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏼‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏽‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FD 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏽‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏾‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FE 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏾‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F468 1F3FB",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F468 1F3FB",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍👨🏻",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F468 1F3FC",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F468 1F3FC",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍👨🏼",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F468 1F3FD",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F468 1F3FD",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍👨🏽",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F468 1F3FE",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F468 1F3FE",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍👨🏾",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 FE0F 200D 1F468 1F3FF",
    "status": "fully-qualified",
    "icon": "👨🏿‍❤️‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone"
  },
  {
    "code_point": "1F468 1F3FF 200D 2764 200D 1F468 1F3FF",
    "status": "minimally-qualified",
    "icon": "👨🏿‍❤‍👨🏿",
    "version": "E13.1",
    "description": "couple with heart: man, man, dark skin tone"
  },
  {
    "code_point": "1F469 200D 2764 FE0F 200D 1F469",
    "status": "fully-qualified",
    "icon": "👩‍❤️‍👩",
    "version": "E2.0",
    "description": "couple with heart: woman, woman"
  },
  {
    "code_point": "1F469 200D 2764 200D 1F469",
    "status": "minimally-qualified",
    "icon": "👩‍❤‍👩",
    "version": "E2.0",
    "description": "couple with heart: woman, woman"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 FE0F 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏻‍❤️‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FB 200D 2764 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏻‍❤‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 FE0F 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏼‍❤️‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FC 200D 2764 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏼‍❤‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-light skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 FE0F 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏽‍❤️‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FD 200D 2764 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏽‍❤‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 FE0F 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏾‍❤️‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FE 200D 2764 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏾‍❤‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, medium-dark skin tone, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F469 1F3FB",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F469 1F3FB",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👩🏻",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F469 1F3FC",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F469 1F3FC",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👩🏼",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium-light skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F469 1F3FD",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F469 1F3FD",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👩🏽",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F469 1F3FE",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F469 1F3FE",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👩🏾",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone, medium-dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 FE0F 200D 1F469 1F3FF",
    "status": "fully-qualified",
    "icon": "👩🏿‍❤️‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone"
  },
  {
    "code_point": "1F469 1F3FF 200D 2764 200D 1F469 1F3FF",
    "status": "minimally-qualified",
    "icon": "👩🏿‍❤‍👩🏿",
    "version": "E13.1",
    "description": "couple with heart: woman, woman, dark skin tone"
  },
  {
    "code_point": "1F468 200D 1F469 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👩‍👦",
    "version": "E2.0",
    "description": "family: man, woman, boy"
  },
  {
    "code_point": "1F468 200D 1F469 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👩‍👧",
    "version": "E2.0",
    "description": "family: man, woman, girl"
  },
  {
    "code_point": "1F468 200D 1F469 200D 1F467 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👩‍👧‍👦",
    "version": "E2.0",
    "description": "family: man, woman, girl, boy"
  },
  {
    "code_point": "1F468 200D 1F469 200D 1F466 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👩‍👦‍👦",
    "version": "E2.0",
    "description": "family: man, woman, boy, boy"
  },
  {
    "code_point": "1F468 200D 1F469 200D 1F467 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👩‍👧‍👧",
    "version": "E2.0",
    "description": "family: man, woman, girl, girl"
  },
  {
    "code_point": "1F468 200D 1F468 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👨‍👦",
    "version": "E2.0",
    "description": "family: man, man, boy"
  },
  {
    "code_point": "1F468 200D 1F468 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👨‍👧",
    "version": "E2.0",
    "description": "family: man, man, girl"
  },
  {
    "code_point": "1F468 200D 1F468 200D 1F467 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👨‍👧‍👦",
    "version": "E2.0",
    "description": "family: man, man, girl, boy"
  },
  {
    "code_point": "1F468 200D 1F468 200D 1F466 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👨‍👦‍👦",
    "version": "E2.0",
    "description": "family: man, man, boy, boy"
  },
  {
    "code_point": "1F468 200D 1F468 200D 1F467 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👨‍👧‍👧",
    "version": "E2.0",
    "description": "family: man, man, girl, girl"
  },
  {
    "code_point": "1F469 200D 1F469 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👩‍👦",
    "version": "E2.0",
    "description": "family: woman, woman, boy"
  },
  {
    "code_point": "1F469 200D 1F469 200D 1F467",
    "status": "fully-qualified",
    "icon": "👩‍👩‍👧",
    "version": "E2.0",
    "description": "family: woman, woman, girl"
  },
  {
    "code_point": "1F469 200D 1F469 200D 1F467 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👩‍👧‍👦",
    "version": "E2.0",
    "description": "family: woman, woman, girl, boy"
  },
  {
    "code_point": "1F469 200D 1F469 200D 1F466 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👩‍👦‍👦",
    "version": "E2.0",
    "description": "family: woman, woman, boy, boy"
  },
  {
    "code_point": "1F469 200D 1F469 200D 1F467 200D 1F467",
    "status": "fully-qualified",
    "icon": "👩‍👩‍👧‍👧",
    "version": "E2.0",
    "description": "family: woman, woman, girl, girl"
  },
  {
    "code_point": "1F468 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👦",
    "version": "E4.0",
    "description": "family: man, boy"
  },
  {
    "code_point": "1F468 200D 1F466 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👦‍👦",
    "version": "E4.0",
    "description": "family: man, boy, boy"
  },
  {
    "code_point": "1F468 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👧",
    "version": "E4.0",
    "description": "family: man, girl"
  },
  {
    "code_point": "1F468 200D 1F467 200D 1F466",
    "status": "fully-qualified",
    "icon": "👨‍👧‍👦",
    "version": "E4.0",
    "description": "family: man, girl, boy"
  },
  {
    "code_point": "1F468 200D 1F467 200D 1F467",
    "status": "fully-qualified",
    "icon": "👨‍👧‍👧",
    "version": "E4.0",
    "description": "family: man, girl, girl"
  },
  {
    "code_point": "1F469 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👦",
    "version": "E4.0",
    "description": "family: woman, boy"
  },
  {
    "code_point": "1F469 200D 1F466 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👦‍👦",
    "version": "E4.0",
    "description": "family: woman, boy, boy"
  },
  {
    "code_point": "1F469 200D 1F467",
    "status": "fully-qualified",
    "icon": "👩‍👧",
    "version": "E4.0",
    "description": "family: woman, girl"
  },
  {
    "code_point": "1F469 200D 1F467 200D 1F466",
    "status": "fully-qualified",
    "icon": "👩‍👧‍👦",
    "version": "E4.0",
    "description": "family: woman, girl, boy"
  },
  {
    "code_point": "1F469 200D 1F467 200D 1F467",
    "status": "fully-qualified",
    "icon": "👩‍👧‍👧",
    "version": "E4.0",
    "description": "family: woman, girl, girl"
  },
  {
    "code_point": "1F5E3 FE0F",
    "status": "fully-qualified",
    "icon": "🗣️",
    "version": "E0.7",
    "description": "speaking head"
  },
  {
    "code_point": "1F5E3",
    "status": "unqualified",
    "icon": "🗣",
    "version": "E0.7",
    "description": "speaking head"
  },
  {
    "code_point": "1F464",
    "status": "fully-qualified",
    "icon": "👤",
    "version": "E0.6",
    "description": "bust in silhouette"
  },
  {
    "code_point": "1F465",
    "status": "fully-qualified",
    "icon": "👥",
    "version": "E1.0",
    "description": "busts in silhouette"
  },
  {
    "code_point": "1FAC2",
    "status": "fully-qualified",
    "icon": "🫂",
    "version": "E13.0",
    "description": "people hugging"
  },
  {
    "code_point": "1F46A",
    "status": "fully-qualified",
    "icon": "👪",
    "version": "E0.6",
    "description": "family"
  },
  {
    "code_point": "1F9D1 200D 1F9D1 200D 1F9D2",
    "status": "fully-qualified",
    "icon": "🧑‍🧑‍🧒",
    "version": "E15.1",
    "description": "family: adult, adult, child"
  },
  {
    "code_point": "1F9D1 200D 1F9D1 200D 1F9D2 200D 1F9D2",
    "status": "fully-qualified",
    "icon": "🧑‍🧑‍🧒‍🧒",
    "version": "E15.1",
    "description": "family: adult, adult, child, child"
  },
  {
    "code_point": "1F9D1 200D 1F9D2",
    "status": "fully-qualified",
    "icon": "🧑‍🧒",
    "version": "E15.1",
    "description": "family: adult, child"
  },
  {
    "code_point": "1F9D1 200D 1F9D2 200D 1F9D2",
    "status": "fully-qualified",
    "icon": "🧑‍🧒‍🧒",
    "version": "E15.1",
    "description": "family: adult, child, child"
  },
  {
    "code_point": "1F463",
    "status": "fully-qualified",
    "icon": "👣",
    "version": "E0.6",
    "description": "footprints"
  },
  {
    "code_point": "1FAC6",
    "status": "fully-qualified",
    "icon": "🫆",
    "version": "E16.0",
    "description": "fingerprint"
  },
  {
    "code_point": "1F3FB",
    "status": "component",
    "icon": "🏻",
    "version": "E1.0",
    "description": "light skin tone"
  },
  {
    "code_point": "1F3FC",
    "status": "component",
    "icon": "🏼",
    "version": "E1.0",
    "description": "medium-light skin tone"
  },
  {
    "code_point": "1F3FD",
    "status": "component",
    "icon": "🏽",
    "version": "E1.0",
    "description": "medium skin tone"
  },
  {
    "code_point": "1F3FE",
    "status": "component",
    "icon": "🏾",
    "version": "E1.0",
    "description": "medium-dark skin tone"
  },
  {
    "code_point": "1F3FF",
    "status": "component",
    "icon": "🏿",
    "version": "E1.0",
    "description": "dark skin tone"
  },
  {
    "code_point": "1F9B0",
    "status": "component",
    "icon": "🦰",
    "version": "E11.0",
    "description": "red hair"
  },
  {
    "code_point": "1F9B1",
    "status": "component",
    "icon": "🦱",
    "version": "E11.0",
    "description": "curly hair"
  },
  {
    "code_point": "1F9B3",
    "status": "component",
    "icon": "🦳",
    "version": "E11.0",
    "description": "white hair"
  },
  {
    "code_point": "1F9B2",
    "status": "component",
    "icon": "🦲",
    "version": "E11.0",
    "description": "bald"
  },
  {
    "code_point": "1F435",
    "status": "fully-qualified",
    "icon": "🐵",
    "version": "E0.6",
    "description": "monkey face"
  },
  {
    "code_point": "1F412",
    "status": "fully-qualified",
    "icon": "🐒",
    "version": "E0.6",
    "description": "monkey"
  },
  {
    "code_point": "1F98D",
    "status": "fully-qualified",
    "icon": "🦍",
    "version": "E3.0",
    "description": "gorilla"
  },
  {
    "code_point": "1F9A7",
    "status": "fully-qualified",
    "icon": "🦧",
    "version": "E12.0",
    "description": "orangutan"
  },
  {
    "code_point": "1F436",
    "status": "fully-qualified",
    "icon": "🐶",
    "version": "E0.6",
    "description": "dog face"
  },
  {
    "code_point": "1F415",
    "status": "fully-qualified",
    "icon": "🐕",
    "version": "E0.7",
    "description": "dog"
  },
  {
    "code_point": "1F9AE",
    "status": "fully-qualified",
    "icon": "🦮",
    "version": "E12.0",
    "description": "guide dog"
  },
  {
    "code_point": "1F415 200D 1F9BA",
    "status": "fully-qualified",
    "icon": "🐕‍🦺",
    "version": "E12.0",
    "description": "service dog"
  },
  {
    "code_point": "1F429",
    "status": "fully-qualified",
    "icon": "🐩",
    "version": "E0.6",
    "description": "poodle"
  },
  {
    "code_point": "1F43A",
    "status": "fully-qualified",
    "icon": "🐺",
    "version": "E0.6",
    "description": "wolf"
  },
  {
    "code_point": "1F98A",
    "status": "fully-qualified",
    "icon": "🦊",
    "version": "E3.0",
    "description": "fox"
  },
  {
    "code_point": "1F99D",
    "status": "fully-qualified",
    "icon": "🦝",
    "version": "E11.0",
    "description": "raccoon"
  },
  {
    "code_point": "1F431",
    "status": "fully-qualified",
    "icon": "🐱",
    "version": "E0.6",
    "description": "cat face"
  },
  {
    "code_point": "1F408",
    "status": "fully-qualified",
    "icon": "🐈",
    "version": "E0.7",
    "description": "cat"
  },
  {
    "code_point": "1F408 200D 2B1B",
    "status": "fully-qualified",
    "icon": "🐈‍⬛",
    "version": "E13.0",
    "description": "black cat"
  },
  {
    "code_point": "1F981",
    "status": "fully-qualified",
    "icon": "🦁",
    "version": "E1.0",
    "description": "lion"
  },
  {
    "code_point": "1F42F",
    "status": "fully-qualified",
    "icon": "🐯",
    "version": "E0.6",
    "description": "tiger face"
  },
  {
    "code_point": "1F405",
    "status": "fully-qualified",
    "icon": "🐅",
    "version": "E1.0",
    "description": "tiger"
  },
  {
    "code_point": "1F406",
    "status": "fully-qualified",
    "icon": "🐆",
    "version": "E1.0",
    "description": "leopard"
  },
  {
    "code_point": "1F434",
    "status": "fully-qualified",
    "icon": "🐴",
    "version": "E0.6",
    "description": "horse face"
  },
  {
    "code_point": "1FACE",
    "status": "fully-qualified",
    "icon": "🫎",
    "version": "E15.0",
    "description": "moose"
  },
  {
    "code_point": "1FACF",
    "status": "fully-qualified",
    "icon": "🫏",
    "version": "E15.0",
    "description": "donkey"
  },
  {
    "code_point": "1F40E",
    "status": "fully-qualified",
    "icon": "🐎",
    "version": "E0.6",
    "description": "horse"
  },
  {
    "code_point": "1F984",
    "status": "fully-qualified",
    "icon": "🦄",
    "version": "E1.0",
    "description": "unicorn"
  },
  {
    "code_point": "1F993",
    "status": "fully-qualified",
    "icon": "🦓",
    "version": "E5.0",
    "description": "zebra"
  },
  {
    "code_point": "1F98C",
    "status": "fully-qualified",
    "icon": "🦌",
    "version": "E3.0",
    "description": "deer"
  },
  {
    "code_point": "1F9AC",
    "status": "fully-qualified",
    "icon": "🦬",
    "version": "E13.0",
    "description": "bison"
  },
  {
    "code_point": "1F42E",
    "status": "fully-qualified",
    "icon": "🐮",
    "version": "E0.6",
    "description": "cow face"
  },
  {
    "code_point": "1F402",
    "status": "fully-qualified",
    "icon": "🐂",
    "version": "E1.0",
    "description": "ox"
  },
  {
    "code_point": "1F403",
    "status": "fully-qualified",
    "icon": "🐃",
    "version": "E1.0",
    "description": "water buffalo"
  },
  {
    "code_point": "1F404",
    "status": "fully-qualified",
    "icon": "🐄",
    "version": "E1.0",
    "description": "cow"
  },
  {
    "code_point": "1F437",
    "status": "fully-qualified",
    "icon": "🐷",
    "version": "E0.6",
    "description": "pig face"
  },
  {
    "code_point": "1F416",
    "status": "fully-qualified",
    "icon": "🐖",
    "version": "E1.0",
    "description": "pig"
  },
  {
    "code_point": "1F417",
    "status": "fully-qualified",
    "icon": "🐗",
    "version": "E0.6",
    "description": "boar"
  },
  {
    "code_point": "1F43D",
    "status": "fully-qualified",
    "icon": "🐽",
    "version": "E0.6",
    "description": "pig nose"
  },
  {
    "code_point": "1F40F",
    "status": "fully-qualified",
    "icon": "🐏",
    "version": "E1.0",
    "description": "ram"
  },
  {
    "code_point": "1F411",
    "status": "fully-qualified",
    "icon": "🐑",
    "version": "E0.6",
    "description": "ewe"
  },
  {
    "code_point": "1F410",
    "status": "fully-qualified",
    "icon": "🐐",
    "version": "E1.0",
    "description": "goat"
  },
  {
    "code_point": "1F42A",
    "status": "fully-qualified",
    "icon": "🐪",
    "version": "E1.0",
    "description": "camel"
  },
  {
    "code_point": "1F42B",
    "status": "fully-qualified",
    "icon": "🐫",
    "version": "E0.6",
    "description": "two-hump camel"
  },
  {
    "code_point": "1F999",
    "status": "fully-qualified",
    "icon": "🦙",
    "version": "E11.0",
    "description": "llama"
  },
  {
    "code_point": "1F992",
    "status": "fully-qualified",
    "icon": "🦒",
    "version": "E5.0",
    "description": "giraffe"
  },
  {
    "code_point": "1F418",
    "status": "fully-qualified",
    "icon": "🐘",
    "version": "E0.6",
    "description": "elephant"
  },
  {
    "code_point": "1F9A3",
    "status": "fully-qualified",
    "icon": "🦣",
    "version": "E13.0",
    "description": "mammoth"
  },
  {
    "code_point": "1F98F",
    "status": "fully-qualified",
    "icon": "🦏",
    "version": "E3.0",
    "description": "rhinoceros"
  },
  {
    "code_point": "1F99B",
    "status": "fully-qualified",
    "icon": "🦛",
    "version": "E11.0",
    "description": "hippopotamus"
  },
  {
    "code_point": "1F42D",
    "status": "fully-qualified",
    "icon": "🐭",
    "version": "E0.6",
    "description": "mouse face"
  },
  {
    "code_point": "1F401",
    "status": "fully-qualified",
    "icon": "🐁",
    "version": "E1.0",
    "description": "mouse"
  },
  {
    "code_point": "1F400",
    "status": "fully-qualified",
    "icon": "🐀",
    "version": "E1.0",
    "description": "rat"
  },
  {
    "code_point": "1F439",
    "status": "fully-qualified",
    "icon": "🐹",
    "version": "E0.6",
    "description": "hamster"
  },
  {
    "code_point": "1F430",
    "status": "fully-qualified",
    "icon": "🐰",
    "version": "E0.6",
    "description": "rabbit face"
  },
  {
    "code_point": "1F407",
    "status": "fully-qualified",
    "icon": "🐇",
    "version": "E1.0",
    "description": "rabbit"
  },
  {
    "code_point": "1F43F FE0F",
    "status": "fully-qualified",
    "icon": "🐿️",
    "version": "E0.7",
    "description": "chipmunk"
  },
  {
    "code_point": "1F43F",
    "status": "unqualified",
    "icon": "🐿",
    "version": "E0.7",
    "description": "chipmunk"
  },
  {
    "code_point": "1F9AB",
    "status": "fully-qualified",
    "icon": "🦫",
    "version": "E13.0",
    "description": "beaver"
  },
  {
    "code_point": "1F994",
    "status": "fully-qualified",
    "icon": "🦔",
    "version": "E5.0",
    "description": "hedgehog"
  },
  {
    "code_point": "1F987",
    "status": "fully-qualified",
    "icon": "🦇",
    "version": "E3.0",
    "description": "bat"
  },
  {
    "code_point": "1F43B",
    "status": "fully-qualified",
    "icon": "🐻",
    "version": "E0.6",
    "description": "bear"
  },
  {
    "code_point": "1F43B 200D 2744 FE0F",
    "status": "fully-qualified",
    "icon": "🐻‍❄️",
    "version": "E13.0",
    "description": "polar bear"
  },
  {
    "code_point": "1F43B 200D 2744",
    "status": "minimally-qualified",
    "icon": "🐻‍❄",
    "version": "E13.0",
    "description": "polar bear"
  },
  {
    "code_point": "1F428",
    "status": "fully-qualified",
    "icon": "🐨",
    "version": "E0.6",
    "description": "koala"
  },
  {
    "code_point": "1F43C",
    "status": "fully-qualified",
    "icon": "🐼",
    "version": "E0.6",
    "description": "panda"
  },
  {
    "code_point": "1F9A5",
    "status": "fully-qualified",
    "icon": "🦥",
    "version": "E12.0",
    "description": "sloth"
  },
  {
    "code_point": "1F9A6",
    "status": "fully-qualified",
    "icon": "🦦",
    "version": "E12.0",
    "description": "otter"
  },
  {
    "code_point": "1F9A8",
    "status": "fully-qualified",
    "icon": "🦨",
    "version": "E12.0",
    "description": "skunk"
  },
  {
    "code_point": "1F998",
    "status": "fully-qualified",
    "icon": "🦘",
    "version": "E11.0",
    "description": "kangaroo"
  },
  {
    "code_point": "1F9A1",
    "status": "fully-qualified",
    "icon": "🦡",
    "version": "E11.0",
    "description": "badger"
  },
  {
    "code_point": "1F43E",
    "status": "fully-qualified",
    "icon": "🐾",
    "version": "E0.6",
    "description": "paw prints"
  },
  {
    "code_point": "1F983",
    "status": "fully-qualified",
    "icon": "🦃",
    "version": "E1.0",
    "description": "turkey"
  },
  {
    "code_point": "1F414",
    "status": "fully-qualified",
    "icon": "🐔",
    "version": "E0.6",
    "description": "chicken"
  },
  {
    "code_point": "1F413",
    "status": "fully-qualified",
    "icon": "🐓",
    "version": "E1.0",
    "description": "rooster"
  },
  {
    "code_point": "1F423",
    "status": "fully-qualified",
    "icon": "🐣",
    "version": "E0.6",
    "description": "hatching chick"
  },
  {
    "code_point": "1F424",
    "status": "fully-qualified",
    "icon": "🐤",
    "version": "E0.6",
    "description": "baby chick"
  },
  {
    "code_point": "1F425",
    "status": "fully-qualified",
    "icon": "🐥",
    "version": "E0.6",
    "description": "front-facing baby chick"
  },
  {
    "code_point": "1F426",
    "status": "fully-qualified",
    "icon": "🐦",
    "version": "E0.6",
    "description": "bird"
  },
  {
    "code_point": "1F427",
    "status": "fully-qualified",
    "icon": "🐧",
    "version": "E0.6",
    "description": "penguin"
  },
  {
    "code_point": "1F54A FE0F",
    "status": "fully-qualified",
    "icon": "🕊️",
    "version": "E0.7",
    "description": "dove"
  },
  {
    "code_point": "1F54A",
    "status": "unqualified",
    "icon": "🕊",
    "version": "E0.7",
    "description": "dove"
  },
  {
    "code_point": "1F985",
    "status": "fully-qualified",
    "icon": "🦅",
    "version": "E3.0",
    "description": "eagle"
  },
  {
    "code_point": "1F986",
    "status": "fully-qualified",
    "icon": "🦆",
    "version": "E3.0",
    "description": "duck"
  },
  {
    "code_point": "1F9A2",
    "status": "fully-qualified",
    "icon": "🦢",
    "version": "E11.0",
    "description": "swan"
  },
  {
    "code_point": "1F989",
    "status": "fully-qualified",
    "icon": "🦉",
    "version": "E3.0",
    "description": "owl"
  },
  {
    "code_point": "1F9A4",
    "status": "fully-qualified",
    "icon": "🦤",
    "version": "E13.0",
    "description": "dodo"
  },
  {
    "code_point": "1FAB6",
    "status": "fully-qualified",
    "icon": "🪶",
    "version": "E13.0",
    "description": "feather"
  },
  {
    "code_point": "1F9A9",
    "status": "fully-qualified",
    "icon": "🦩",
    "version": "E12.0",
    "description": "flamingo"
  },
  {
    "code_point": "1F99A",
    "status": "fully-qualified",
    "icon": "🦚",
    "version": "E11.0",
    "description": "peacock"
  },
  {
    "code_point": "1F99C",
    "status": "fully-qualified",
    "icon": "🦜",
    "version": "E11.0",
    "description": "parrot"
  },
  {
    "code_point": "1FABD",
    "status": "fully-qualified",
    "icon": "🪽",
    "version": "E15.0",
    "description": "wing"
  },
  {
    "code_point": "1F426 200D 2B1B",
    "status": "fully-qualified",
    "icon": "🐦‍⬛",
    "version": "E15.0",
    "description": "black bird"
  },
  {
    "code_point": "1FABF",
    "status": "fully-qualified",
    "icon": "🪿",
    "version": "E15.0",
    "description": "goose"
  },
  {
    "code_point": "1F426 200D 1F525",
    "status": "fully-qualified",
    "icon": "🐦‍🔥",
    "version": "E15.1",
    "description": "phoenix"
  },
  {
    "code_point": "1F438",
    "status": "fully-qualified",
    "icon": "🐸",
    "version": "E0.6",
    "description": "frog"
  },
  {
    "code_point": "1F40A",
    "status": "fully-qualified",
    "icon": "🐊",
    "version": "E1.0",
    "description": "crocodile"
  },
  {
    "code_point": "1F422",
    "status": "fully-qualified",
    "icon": "🐢",
    "version": "E0.6",
    "description": "turtle"
  },
  {
    "code_point": "1F98E",
    "status": "fully-qualified",
    "icon": "🦎",
    "version": "E3.0",
    "description": "lizard"
  },
  {
    "code_point": "1F40D",
    "status": "fully-qualified",
    "icon": "🐍",
    "version": "E0.6",
    "description": "snake"
  },
  {
    "code_point": "1F432",
    "status": "fully-qualified",
    "icon": "🐲",
    "version": "E0.6",
    "description": "dragon face"
  },
  {
    "code_point": "1F409",
    "status": "fully-qualified",
    "icon": "🐉",
    "version": "E1.0",
    "description": "dragon"
  },
  {
    "code_point": "1F995",
    "status": "fully-qualified",
    "icon": "🦕",
    "version": "E5.0",
    "description": "sauropod"
  },
  {
    "code_point": "1F996",
    "status": "fully-qualified",
    "icon": "🦖",
    "version": "E5.0",
    "description": "T-Rex"
  },
  {
    "code_point": "1F433",
    "status": "fully-qualified",
    "icon": "🐳",
    "version": "E0.6",
    "description": "spouting whale"
  },
  {
    "code_point": "1F40B",
    "status": "fully-qualified",
    "icon": "🐋",
    "version": "E1.0",
    "description": "whale"
  },
  {
    "code_point": "1F42C",
    "status": "fully-qualified",
    "icon": "🐬",
    "version": "E0.6",
    "description": "dolphin"
  },
  {
    "code_point": "1F9AD",
    "status": "fully-qualified",
    "icon": "🦭",
    "version": "E13.0",
    "description": "seal"
  },
  {
    "code_point": "1F41F",
    "status": "fully-qualified",
    "icon": "🐟",
    "version": "E0.6",
    "description": "fish"
  },
  {
    "code_point": "1F420",
    "status": "fully-qualified",
    "icon": "🐠",
    "version": "E0.6",
    "description": "tropical fish"
  },
  {
    "code_point": "1F421",
    "status": "fully-qualified",
    "icon": "🐡",
    "version": "E0.6",
    "description": "blowfish"
  },
  {
    "code_point": "1F988",
    "status": "fully-qualified",
    "icon": "🦈",
    "version": "E3.0",
    "description": "shark"
  },
  {
    "code_point": "1F419",
    "status": "fully-qualified",
    "icon": "🐙",
    "version": "E0.6",
    "description": "octopus"
  },
  {
    "code_point": "1F41A",
    "status": "fully-qualified",
    "icon": "🐚",
    "version": "E0.6",
    "description": "spiral shell"
  },
  {
    "code_point": "1FAB8",
    "status": "fully-qualified",
    "icon": "🪸",
    "version": "E14.0",
    "description": "coral"
  },
  {
    "code_point": "1FABC",
    "status": "fully-qualified",
    "icon": "🪼",
    "version": "E15.0",
    "description": "jellyfish"
  },
  {
    "code_point": "1F980",
    "status": "fully-qualified",
    "icon": "🦀",
    "version": "E1.0",
    "description": "crab"
  },
  {
    "code_point": "1F99E",
    "status": "fully-qualified",
    "icon": "🦞",
    "version": "E11.0",
    "description": "lobster"
  },
  {
    "code_point": "1F990",
    "status": "fully-qualified",
    "icon": "🦐",
    "version": "E3.0",
    "description": "shrimp"
  },
  {
    "code_point": "1F991",
    "status": "fully-qualified",
    "icon": "🦑",
    "version": "E3.0",
    "description": "squid"
  },
  {
    "code_point": "1F9AA",
    "status": "fully-qualified",
    "icon": "🦪",
    "version": "E12.0",
    "description": "oyster"
  },
  {
    "code_point": "1F40C",
    "status": "fully-qualified",
    "icon": "🐌",
    "version": "E0.6",
    "description": "snail"
  },
  {
    "code_point": "1F98B",
    "status": "fully-qualified",
    "icon": "🦋",
    "version": "E3.0",
    "description": "butterfly"
  },
  {
    "code_point": "1F41B",
    "status": "fully-qualified",
    "icon": "🐛",
    "version": "E0.6",
    "description": "bug"
  },
  {
    "code_point": "1F41C",
    "status": "fully-qualified",
    "icon": "🐜",
    "version": "E0.6",
    "description": "ant"
  },
  {
    "code_point": "1F41D",
    "status": "fully-qualified",
    "icon": "🐝",
    "version": "E0.6",
    "description": "honeybee"
  },
  {
    "code_point": "1FAB2",
    "status": "fully-qualified",
    "icon": "🪲",
    "version": "E13.0",
    "description": "beetle"
  },
  {
    "code_point": "1F41E",
    "status": "fully-qualified",
    "icon": "🐞",
    "version": "E0.6",
    "description": "lady beetle"
  },
  {
    "code_point": "1F997",
    "status": "fully-qualified",
    "icon": "🦗",
    "version": "E5.0",
    "description": "cricket"
  },
  {
    "code_point": "1FAB3",
    "status": "fully-qualified",
    "icon": "🪳",
    "version": "E13.0",
    "description": "cockroach"
  },
  {
    "code_point": "1F577 FE0F",
    "status": "fully-qualified",
    "icon": "🕷️",
    "version": "E0.7",
    "description": "spider"
  },
  {
    "code_point": "1F577",
    "status": "unqualified",
    "icon": "🕷",
    "version": "E0.7",
    "description": "spider"
  },
  {
    "code_point": "1F578 FE0F",
    "status": "fully-qualified",
    "icon": "🕸️",
    "version": "E0.7",
    "description": "spider web"
  },
  {
    "code_point": "1F578",
    "status": "unqualified",
    "icon": "🕸",
    "version": "E0.7",
    "description": "spider web"
  },
  {
    "code_point": "1F982",
    "status": "fully-qualified",
    "icon": "🦂",
    "version": "E1.0",
    "description": "scorpion"
  },
  {
    "code_point": "1F99F",
    "status": "fully-qualified",
    "icon": "🦟",
    "version": "E11.0",
    "description": "mosquito"
  },
  {
    "code_point": "1FAB0",
    "status": "fully-qualified",
    "icon": "🪰",
    "version": "E13.0",
    "description": "fly"
  },
  {
    "code_point": "1FAB1",
    "status": "fully-qualified",
    "icon": "🪱",
    "version": "E13.0",
    "description": "worm"
  },
  {
    "code_point": "1F9A0",
    "status": "fully-qualified",
    "icon": "🦠",
    "version": "E11.0",
    "description": "microbe"
  },
  {
    "code_point": "1F490",
    "status": "fully-qualified",
    "icon": "💐",
    "version": "E0.6",
    "description": "bouquet"
  },
  {
    "code_point": "1F338",
    "status": "fully-qualified",
    "icon": "🌸",
    "version": "E0.6",
    "description": "cherry blossom"
  },
  {
    "code_point": "1F4AE",
    "status": "fully-qualified",
    "icon": "💮",
    "version": "E0.6",
    "description": "white flower"
  },
  {
    "code_point": "1FAB7",
    "status": "fully-qualified",
    "icon": "🪷",
    "version": "E14.0",
    "description": "lotus"
  },
  {
    "code_point": "1F3F5 FE0F",
    "status": "fully-qualified",
    "icon": "🏵️",
    "version": "E0.7",
    "description": "rosette"
  },
  {
    "code_point": "1F3F5",
    "status": "unqualified",
    "icon": "🏵",
    "version": "E0.7",
    "description": "rosette"
  },
  {
    "code_point": "1F339",
    "status": "fully-qualified",
    "icon": "🌹",
    "version": "E0.6",
    "description": "rose"
  },
  {
    "code_point": "1F940",
    "status": "fully-qualified",
    "icon": "🥀",
    "version": "E3.0",
    "description": "wilted flower"
  },
  {
    "code_point": "1F33A",
    "status": "fully-qualified",
    "icon": "🌺",
    "version": "E0.6",
    "description": "hibiscus"
  },
  {
    "code_point": "1F33B",
    "status": "fully-qualified",
    "icon": "🌻",
    "version": "E0.6",
    "description": "sunflower"
  },
  {
    "code_point": "1F33C",
    "status": "fully-qualified",
    "icon": "🌼",
    "version": "E0.6",
    "description": "blossom"
  },
  {
    "code_point": "1F337",
    "status": "fully-qualified",
    "icon": "🌷",
    "version": "E0.6",
    "description": "tulip"
  },
  {
    "code_point": "1FABB",
    "status": "fully-qualified",
    "icon": "🪻",
    "version": "E15.0",
    "description": "hyacinth"
  },
  {
    "code_point": "1F331",
    "status": "fully-qualified",
    "icon": "🌱",
    "version": "E0.6",
    "description": "seedling"
  },
  {
    "code_point": "1FAB4",
    "status": "fully-qualified",
    "icon": "🪴",
    "version": "E13.0",
    "description": "potted plant"
  },
  {
    "code_point": "1F332",
    "status": "fully-qualified",
    "icon": "🌲",
    "version": "E1.0",
    "description": "evergreen tree"
  },
  {
    "code_point": "1F333",
    "status": "fully-qualified",
    "icon": "🌳",
    "version": "E1.0",
    "description": "deciduous tree"
  },
  {
    "code_point": "1F334",
    "status": "fully-qualified",
    "icon": "🌴",
    "version": "E0.6",
    "description": "palm tree"
  },
  {
    "code_point": "1F335",
    "status": "fully-qualified",
    "icon": "🌵",
    "version": "E0.6",
    "description": "cactus"
  },
  {
    "code_point": "1F33E",
    "status": "fully-qualified",
    "icon": "🌾",
    "version": "E0.6",
    "description": "sheaf of rice"
  },
  {
    "code_point": "1F33F",
    "status": "fully-qualified",
    "icon": "🌿",
    "version": "E0.6",
    "description": "herb"
  },
  {
    "code_point": "2618 FE0F",
    "status": "fully-qualified",
    "icon": "☘️",
    "version": "E1.0",
    "description": "shamrock"
  },
  {
    "code_point": "2618",
    "status": "unqualified",
    "icon": "☘",
    "version": "E1.0",
    "description": "shamrock"
  },
  {
    "code_point": "1F340",
    "status": "fully-qualified",
    "icon": "🍀",
    "version": "E0.6",
    "description": "four leaf clover"
  },
  {
    "code_point": "1F341",
    "status": "fully-qualified",
    "icon": "🍁",
    "version": "E0.6",
    "description": "maple leaf"
  },
  {
    "code_point": "1F342",
    "status": "fully-qualified",
    "icon": "🍂",
    "version": "E0.6",
    "description": "fallen leaf"
  },
  {
    "code_point": "1F343",
    "status": "fully-qualified",
    "icon": "🍃",
    "version": "E0.6",
    "description": "leaf fluttering in wind"
  },
  {
    "code_point": "1FAB9",
    "status": "fully-qualified",
    "icon": "🪹",
    "version": "E14.0",
    "description": "empty nest"
  },
  {
    "code_point": "1FABA",
    "status": "fully-qualified",
    "icon": "🪺",
    "version": "E14.0",
    "description": "nest with eggs"
  },
  {
    "code_point": "1F344",
    "status": "fully-qualified",
    "icon": "🍄",
    "version": "E0.6",
    "description": "mushroom"
  },
  {
    "code_point": "1FABE",
    "status": "fully-qualified",
    "icon": "🪾",
    "version": "E16.0",
    "description": "leafless tree"
  },
  {
    "code_point": "1F347",
    "status": "fully-qualified",
    "icon": "🍇",
    "version": "E0.6",
    "description": "grapes"
  },
  {
    "code_point": "1F348",
    "status": "fully-qualified",
    "icon": "🍈",
    "version": "E0.6",
    "description": "melon"
  },
  {
    "code_point": "1F349",
    "status": "fully-qualified",
    "icon": "🍉",
    "version": "E0.6",
    "description": "watermelon"
  },
  {
    "code_point": "1F34A",
    "status": "fully-qualified",
    "icon": "🍊",
    "version": "E0.6",
    "description": "tangerine"
  },
  {
    "code_point": "1F34B",
    "status": "fully-qualified",
    "icon": "🍋",
    "version": "E1.0",
    "description": "lemon"
  },
  {
    "code_point": "1F34B 200D 1F7E9",
    "status": "fully-qualified",
    "icon": "🍋‍🟩",
    "version": "E15.1",
    "description": "lime"
  },
  {
    "code_point": "1F34C",
    "status": "fully-qualified",
    "icon": "🍌",
    "version": "E0.6",
    "description": "banana"
  },
  {
    "code_point": "1F34D",
    "status": "fully-qualified",
    "icon": "🍍",
    "version": "E0.6",
    "description": "pineapple"
  },
  {
    "code_point": "1F96D",
    "status": "fully-qualified",
    "icon": "🥭",
    "version": "E11.0",
    "description": "mango"
  },
  {
    "code_point": "1F34E",
    "status": "fully-qualified",
    "icon": "🍎",
    "version": "E0.6",
    "description": "red apple"
  },
  {
    "code_point": "1F34F",
    "status": "fully-qualified",
    "icon": "🍏",
    "version": "E0.6",
    "description": "green apple"
  },
  {
    "code_point": "1F350",
    "status": "fully-qualified",
    "icon": "🍐",
    "version": "E1.0",
    "description": "pear"
  },
  {
    "code_point": "1F351",
    "status": "fully-qualified",
    "icon": "🍑",
    "version": "E0.6",
    "description": "peach"
  },
  {
    "code_point": "1F352",
    "status": "fully-qualified",
    "icon": "🍒",
    "version": "E0.6",
    "description": "cherries"
  },
  {
    "code_point": "1F353",
    "status": "fully-qualified",
    "icon": "🍓",
    "version": "E0.6",
    "description": "strawberry"
  },
  {
    "code_point": "1FAD0",
    "status": "fully-qualified",
    "icon": "🫐",
    "version": "E13.0",
    "description": "blueberries"
  },
  {
    "code_point": "1F95D",
    "status": "fully-qualified",
    "icon": "🥝",
    "version": "E3.0",
    "description": "kiwi fruit"
  },
  {
    "code_point": "1F345",
    "status": "fully-qualified",
    "icon": "🍅",
    "version": "E0.6",
    "description": "tomato"
  },
  {
    "code_point": "1FAD2",
    "status": "fully-qualified",
    "icon": "🫒",
    "version": "E13.0",
    "description": "olive"
  },
  {
    "code_point": "1F965",
    "status": "fully-qualified",
    "icon": "🥥",
    "version": "E5.0",
    "description": "coconut"
  },
  {
    "code_point": "1F951",
    "status": "fully-qualified",
    "icon": "🥑",
    "version": "E3.0",
    "description": "avocado"
  },
  {
    "code_point": "1F346",
    "status": "fully-qualified",
    "icon": "🍆",
    "version": "E0.6",
    "description": "eggplant"
  },
  {
    "code_point": "1F954",
    "status": "fully-qualified",
    "icon": "🥔",
    "version": "E3.0",
    "description": "potato"
  },
  {
    "code_point": "1F955",
    "status": "fully-qualified",
    "icon": "🥕",
    "version": "E3.0",
    "description": "carrot"
  },
  {
    "code_point": "1F33D",
    "status": "fully-qualified",
    "icon": "🌽",
    "version": "E0.6",
    "description": "ear of corn"
  },
  {
    "code_point": "1F336 FE0F",
    "status": "fully-qualified",
    "icon": "🌶️",
    "version": "E0.7",
    "description": "hot pepper"
  },
  {
    "code_point": "1F336",
    "status": "unqualified",
    "icon": "🌶",
    "version": "E0.7",
    "description": "hot pepper"
  },
  {
    "code_point": "1FAD1",
    "status": "fully-qualified",
    "icon": "🫑",
    "version": "E13.0",
    "description": "bell pepper"
  },
  {
    "code_point": "1F952",
    "status": "fully-qualified",
    "icon": "🥒",
    "version": "E3.0",
    "description": "cucumber"
  },
  {
    "code_point": "1F96C",
    "status": "fully-qualified",
    "icon": "🥬",
    "version": "E11.0",
    "description": "leafy green"
  },
  {
    "code_point": "1F966",
    "status": "fully-qualified",
    "icon": "🥦",
    "version": "E5.0",
    "description": "broccoli"
  },
  {
    "code_point": "1F9C4",
    "status": "fully-qualified",
    "icon": "🧄",
    "version": "E12.0",
    "description": "garlic"
  },
  {
    "code_point": "1F9C5",
    "status": "fully-qualified",
    "icon": "🧅",
    "version": "E12.0",
    "description": "onion"
  },
  {
    "code_point": "1F95C",
    "status": "fully-qualified",
    "icon": "🥜",
    "version": "E3.0",
    "description": "peanuts"
  },
  {
    "code_point": "1FAD8",
    "status": "fully-qualified",
    "icon": "🫘",
    "version": "E14.0",
    "description": "beans"
  },
  {
    "code_point": "1F330",
    "status": "fully-qualified",
    "icon": "🌰",
    "version": "E0.6",
    "description": "chestnut"
  },
  {
    "code_point": "1FADA",
    "status": "fully-qualified",
    "icon": "🫚",
    "version": "E15.0",
    "description": "ginger root"
  },
  {
    "code_point": "1FADB",
    "status": "fully-qualified",
    "icon": "🫛",
    "version": "E15.0",
    "description": "pea pod"
  },
  {
    "code_point": "1F344 200D 1F7EB",
    "status": "fully-qualified",
    "icon": "🍄‍🟫",
    "version": "E15.1",
    "description": "brown mushroom"
  },
  {
    "code_point": "1FADC",
    "status": "fully-qualified",
    "icon": "🫜",
    "version": "E16.0",
    "description": "root vegetable"
  },
  {
    "code_point": "1F35E",
    "status": "fully-qualified",
    "icon": "🍞",
    "version": "E0.6",
    "description": "bread"
  },
  {
    "code_point": "1F950",
    "status": "fully-qualified",
    "icon": "🥐",
    "version": "E3.0",
    "description": "croissant"
  },
  {
    "code_point": "1F956",
    "status": "fully-qualified",
    "icon": "🥖",
    "version": "E3.0",
    "description": "baguette bread"
  },
  {
    "code_point": "1FAD3",
    "status": "fully-qualified",
    "icon": "🫓",
    "version": "E13.0",
    "description": "flatbread"
  },
  {
    "code_point": "1F968",
    "status": "fully-qualified",
    "icon": "🥨",
    "version": "E5.0",
    "description": "pretzel"
  },
  {
    "code_point": "1F96F",
    "status": "fully-qualified",
    "icon": "🥯",
    "version": "E11.0",
    "description": "bagel"
  },
  {
    "code_point": "1F95E",
    "status": "fully-qualified",
    "icon": "🥞",
    "version": "E3.0",
    "description": "pancakes"
  },
  {
    "code_point": "1F9C7",
    "status": "fully-qualified",
    "icon": "🧇",
    "version": "E12.0",
    "description": "waffle"
  },
  {
    "code_point": "1F9C0",
    "status": "fully-qualified",
    "icon": "🧀",
    "version": "E1.0",
    "description": "cheese wedge"
  },
  {
    "code_point": "1F356",
    "status": "fully-qualified",
    "icon": "🍖",
    "version": "E0.6",
    "description": "meat on bone"
  },
  {
    "code_point": "1F357",
    "status": "fully-qualified",
    "icon": "🍗",
    "version": "E0.6",
    "description": "poultry leg"
  },
  {
    "code_point": "1F969",
    "status": "fully-qualified",
    "icon": "🥩",
    "version": "E5.0",
    "description": "cut of meat"
  },
  {
    "code_point": "1F953",
    "status": "fully-qualified",
    "icon": "🥓",
    "version": "E3.0",
    "description": "bacon"
  },
  {
    "code_point": "1F354",
    "status": "fully-qualified",
    "icon": "🍔",
    "version": "E0.6",
    "description": "hamburger"
  },
  {
    "code_point": "1F35F",
    "status": "fully-qualified",
    "icon": "🍟",
    "version": "E0.6",
    "description": "french fries"
  },
  {
    "code_point": "1F355",
    "status": "fully-qualified",
    "icon": "🍕",
    "version": "E0.6",
    "description": "pizza"
  },
  {
    "code_point": "1F32D",
    "status": "fully-qualified",
    "icon": "🌭",
    "version": "E1.0",
    "description": "hot dog"
  },
  {
    "code_point": "1F96A",
    "status": "fully-qualified",
    "icon": "🥪",
    "version": "E5.0",
    "description": "sandwich"
  },
  {
    "code_point": "1F32E",
    "status": "fully-qualified",
    "icon": "🌮",
    "version": "E1.0",
    "description": "taco"
  },
  {
    "code_point": "1F32F",
    "status": "fully-qualified",
    "icon": "🌯",
    "version": "E1.0",
    "description": "burrito"
  },
  {
    "code_point": "1FAD4",
    "status": "fully-qualified",
    "icon": "🫔",
    "version": "E13.0",
    "description": "tamale"
  },
  {
    "code_point": "1F959",
    "status": "fully-qualified",
    "icon": "🥙",
    "version": "E3.0",
    "description": "stuffed flatbread"
  },
  {
    "code_point": "1F9C6",
    "status": "fully-qualified",
    "icon": "🧆",
    "version": "E12.0",
    "description": "falafel"
  },
  {
    "code_point": "1F95A",
    "status": "fully-qualified",
    "icon": "🥚",
    "version": "E3.0",
    "description": "egg"
  },
  {
    "code_point": "1F373",
    "status": "fully-qualified",
    "icon": "🍳",
    "version": "E0.6",
    "description": "cooking"
  },
  {
    "code_point": "1F958",
    "status": "fully-qualified",
    "icon": "🥘",
    "version": "E3.0",
    "description": "shallow pan of food"
  },
  {
    "code_point": "1F372",
    "status": "fully-qualified",
    "icon": "🍲",
    "version": "E0.6",
    "description": "pot of food"
  },
  {
    "code_point": "1FAD5",
    "status": "fully-qualified",
    "icon": "🫕",
    "version": "E13.0",
    "description": "fondue"
  },
  {
    "code_point": "1F963",
    "status": "fully-qualified",
    "icon": "🥣",
    "version": "E5.0",
    "description": "bowl with spoon"
  },
  {
    "code_point": "1F957",
    "status": "fully-qualified",
    "icon": "🥗",
    "version": "E3.0",
    "description": "green salad"
  },
  {
    "code_point": "1F37F",
    "status": "fully-qualified",
    "icon": "🍿",
    "version": "E1.0",
    "description": "popcorn"
  },
  {
    "code_point": "1F9C8",
    "status": "fully-qualified",
    "icon": "🧈",
    "version": "E12.0",
    "description": "butter"
  },
  {
    "code_point": "1F9C2",
    "status": "fully-qualified",
    "icon": "🧂",
    "version": "E11.0",
    "description": "salt"
  },
  {
    "code_point": "1F96B",
    "status": "fully-qualified",
    "icon": "🥫",
    "version": "E5.0",
    "description": "canned food"
  },
  {
    "code_point": "1F371",
    "status": "fully-qualified",
    "icon": "🍱",
    "version": "E0.6",
    "description": "bento box"
  },
  {
    "code_point": "1F358",
    "status": "fully-qualified",
    "icon": "🍘",
    "version": "E0.6",
    "description": "rice cracker"
  },
  {
    "code_point": "1F359",
    "status": "fully-qualified",
    "icon": "🍙",
    "version": "E0.6",
    "description": "rice ball"
  },
  {
    "code_point": "1F35A",
    "status": "fully-qualified",
    "icon": "🍚",
    "version": "E0.6",
    "description": "cooked rice"
  },
  {
    "code_point": "1F35B",
    "status": "fully-qualified",
    "icon": "🍛",
    "version": "E0.6",
    "description": "curry rice"
  },
  {
    "code_point": "1F35C",
    "status": "fully-qualified",
    "icon": "🍜",
    "version": "E0.6",
    "description": "steaming bowl"
  },
  {
    "code_point": "1F35D",
    "status": "fully-qualified",
    "icon": "🍝",
    "version": "E0.6",
    "description": "spaghetti"
  },
  {
    "code_point": "1F360",
    "status": "fully-qualified",
    "icon": "🍠",
    "version": "E0.6",
    "description": "roasted sweet potato"
  },
  {
    "code_point": "1F362",
    "status": "fully-qualified",
    "icon": "🍢",
    "version": "E0.6",
    "description": "oden"
  },
  {
    "code_point": "1F363",
    "status": "fully-qualified",
    "icon": "🍣",
    "version": "E0.6",
    "description": "sushi"
  },
  {
    "code_point": "1F364",
    "status": "fully-qualified",
    "icon": "🍤",
    "version": "E0.6",
    "description": "fried shrimp"
  },
  {
    "code_point": "1F365",
    "status": "fully-qualified",
    "icon": "🍥",
    "version": "E0.6",
    "description": "fish cake with swirl"
  },
  {
    "code_point": "1F96E",
    "status": "fully-qualified",
    "icon": "🥮",
    "version": "E11.0",
    "description": "moon cake"
  },
  {
    "code_point": "1F361",
    "status": "fully-qualified",
    "icon": "🍡",
    "version": "E0.6",
    "description": "dango"
  },
  {
    "code_point": "1F95F",
    "status": "fully-qualified",
    "icon": "🥟",
    "version": "E5.0",
    "description": "dumpling"
  },
  {
    "code_point": "1F960",
    "status": "fully-qualified",
    "icon": "🥠",
    "version": "E5.0",
    "description": "fortune cookie"
  },
  {
    "code_point": "1F961",
    "status": "fully-qualified",
    "icon": "🥡",
    "version": "E5.0",
    "description": "takeout box"
  },
  {
    "code_point": "1F366",
    "status": "fully-qualified",
    "icon": "🍦",
    "version": "E0.6",
    "description": "soft ice cream"
  },
  {
    "code_point": "1F367",
    "status": "fully-qualified",
    "icon": "🍧",
    "version": "E0.6",
    "description": "shaved ice"
  },
  {
    "code_point": "1F368",
    "status": "fully-qualified",
    "icon": "🍨",
    "version": "E0.6",
    "description": "ice cream"
  },
  {
    "code_point": "1F369",
    "status": "fully-qualified",
    "icon": "🍩",
    "version": "E0.6",
    "description": "doughnut"
  },
  {
    "code_point": "1F36A",
    "status": "fully-qualified",
    "icon": "🍪",
    "version": "E0.6",
    "description": "cookie"
  },
  {
    "code_point": "1F382",
    "status": "fully-qualified",
    "icon": "🎂",
    "version": "E0.6",
    "description": "birthday cake"
  },
  {
    "code_point": "1F370",
    "status": "fully-qualified",
    "icon": "🍰",
    "version": "E0.6",
    "description": "shortcake"
  },
  {
    "code_point": "1F9C1",
    "status": "fully-qualified",
    "icon": "🧁",
    "version": "E11.0",
    "description": "cupcake"
  },
  {
    "code_point": "1F967",
    "status": "fully-qualified",
    "icon": "🥧",
    "version": "E5.0",
    "description": "pie"
  },
  {
    "code_point": "1F36B",
    "status": "fully-qualified",
    "icon": "🍫",
    "version": "E0.6",
    "description": "chocolate bar"
  },
  {
    "code_point": "1F36C",
    "status": "fully-qualified",
    "icon": "🍬",
    "version": "E0.6",
    "description": "candy"
  },
  {
    "code_point": "1F36D",
    "status": "fully-qualified",
    "icon": "🍭",
    "version": "E0.6",
    "description": "lollipop"
  },
  {
    "code_point": "1F36E",
    "status": "fully-qualified",
    "icon": "🍮",
    "version": "E0.6",
    "description": "custard"
  },
  {
    "code_point": "1F36F",
    "status": "fully-qualified",
    "icon": "🍯",
    "version": "E0.6",
    "description": "honey pot"
  },
  {
    "code_point": "1F37C",
    "status": "fully-qualified",
    "icon": "🍼",
    "version": "E1.0",
    "description": "baby bottle"
  },
  {
    "code_point": "1F95B",
    "status": "fully-qualified",
    "icon": "🥛",
    "version": "E3.0",
    "description": "glass of milk"
  },
  {
    "code_point": "2615",
    "status": "fully-qualified",
    "icon": "☕",
    "version": "E0.6",
    "description": "hot beverage"
  },
  {
    "code_point": "1FAD6",
    "status": "fully-qualified",
    "icon": "🫖",
    "version": "E13.0",
    "description": "teapot"
  },
  {
    "code_point": "1F375",
    "status": "fully-qualified",
    "icon": "🍵",
    "version": "E0.6",
    "description": "teacup without handle"
  },
  {
    "code_point": "1F376",
    "status": "fully-qualified",
    "icon": "🍶",
    "version": "E0.6",
    "description": "sake"
  },
  {
    "code_point": "1F37E",
    "status": "fully-qualified",
    "icon": "🍾",
    "version": "E1.0",
    "description": "bottle with popping cork"
  },
  {
    "code_point": "1F377",
    "status": "fully-qualified",
    "icon": "🍷",
    "version": "E0.6",
    "description": "wine glass"
  },
  {
    "code_point": "1F378",
    "status": "fully-qualified",
    "icon": "🍸",
    "version": "E0.6",
    "description": "cocktail glass"
  },
  {
    "code_point": "1F379",
    "status": "fully-qualified",
    "icon": "🍹",
    "version": "E0.6",
    "description": "tropical drink"
  },
  {
    "code_point": "1F37A",
    "status": "fully-qualified",
    "icon": "🍺",
    "version": "E0.6",
    "description": "beer mug"
  },
  {
    "code_point": "1F37B",
    "status": "fully-qualified",
    "icon": "🍻",
    "version": "E0.6",
    "description": "clinking beer mugs"
  },
  {
    "code_point": "1F942",
    "status": "fully-qualified",
    "icon": "🥂",
    "version": "E3.0",
    "description": "clinking glasses"
  },
  {
    "code_point": "1F943",
    "status": "fully-qualified",
    "icon": "🥃",
    "version": "E3.0",
    "description": "tumbler glass"
  },
  {
    "code_point": "1FAD7",
    "status": "fully-qualified",
    "icon": "🫗",
    "version": "E14.0",
    "description": "pouring liquid"
  },
  {
    "code_point": "1F964",
    "status": "fully-qualified",
    "icon": "🥤",
    "version": "E5.0",
    "description": "cup with straw"
  },
  {
    "code_point": "1F9CB",
    "status": "fully-qualified",
    "icon": "🧋",
    "version": "E13.0",
    "description": "bubble tea"
  },
  {
    "code_point": "1F9C3",
    "status": "fully-qualified",
    "icon": "🧃",
    "version": "E12.0",
    "description": "beverage box"
  },
  {
    "code_point": "1F9C9",
    "status": "fully-qualified",
    "icon": "🧉",
    "version": "E12.0",
    "description": "mate"
  },
  {
    "code_point": "1F9CA",
    "status": "fully-qualified",
    "icon": "🧊",
    "version": "E12.0",
    "description": "ice"
  },
  {
    "code_point": "1F962",
    "status": "fully-qualified",
    "icon": "🥢",
    "version": "E5.0",
    "description": "chopsticks"
  },
  {
    "code_point": "1F37D FE0F",
    "status": "fully-qualified",
    "icon": "🍽️",
    "version": "E0.7",
    "description": "fork and knife with plate"
  },
  {
    "code_point": "1F37D",
    "status": "unqualified",
    "icon": "🍽",
    "version": "E0.7",
    "description": "fork and knife with plate"
  },
  {
    "code_point": "1F374",
    "status": "fully-qualified",
    "icon": "🍴",
    "version": "E0.6",
    "description": "fork and knife"
  },
  {
    "code_point": "1F944",
    "status": "fully-qualified",
    "icon": "🥄",
    "version": "E3.0",
    "description": "spoon"
  },
  {
    "code_point": "1F52A",
    "status": "fully-qualified",
    "icon": "🔪",
    "version": "E0.6",
    "description": "kitchen knife"
  },
  {
    "code_point": "1FAD9",
    "status": "fully-qualified",
    "icon": "🫙",
    "version": "E14.0",
    "description": "jar"
  },
  {
    "code_point": "1F3FA",
    "status": "fully-qualified",
    "icon": "🏺",
    "version": "E1.0",
    "description": "amphora"
  },
  {
    "code_point": "1F30D",
    "status": "fully-qualified",
    "icon": "🌍",
    "version": "E0.7",
    "description": "globe showing Europe-Africa"
  },
  {
    "code_point": "1F30E",
    "status": "fully-qualified",
    "icon": "🌎",
    "version": "E0.7",
    "description": "globe showing Americas"
  },
  {
    "code_point": "1F30F",
    "status": "fully-qualified",
    "icon": "🌏",
    "version": "E0.6",
    "description": "globe showing Asia-Australia"
  },
  {
    "code_point": "1F310",
    "status": "fully-qualified",
    "icon": "🌐",
    "version": "E1.0",
    "description": "globe with meridians"
  },
  {
    "code_point": "1F5FA FE0F",
    "status": "fully-qualified",
    "icon": "🗺️",
    "version": "E0.7",
    "description": "world map"
  },
  {
    "code_point": "1F5FA",
    "status": "unqualified",
    "icon": "🗺",
    "version": "E0.7",
    "description": "world map"
  },
  {
    "code_point": "1F5FE",
    "status": "fully-qualified",
    "icon": "🗾",
    "version": "E0.6",
    "description": "map of Japan"
  },
  {
    "code_point": "1F9ED",
    "status": "fully-qualified",
    "icon": "🧭",
    "version": "E11.0",
    "description": "compass"
  },
  {
    "code_point": "1F3D4 FE0F",
    "status": "fully-qualified",
    "icon": "🏔️",
    "version": "E0.7",
    "description": "snow-capped mountain"
  },
  {
    "code_point": "1F3D4",
    "status": "unqualified",
    "icon": "🏔",
    "version": "E0.7",
    "description": "snow-capped mountain"
  },
  {
    "code_point": "26F0 FE0F",
    "status": "fully-qualified",
    "icon": "⛰️",
    "version": "E0.7",
    "description": "mountain"
  },
  {
    "code_point": "26F0",
    "status": "unqualified",
    "icon": "⛰",
    "version": "E0.7",
    "description": "mountain"
  },
  {
    "code_point": "1F30B",
    "status": "fully-qualified",
    "icon": "🌋",
    "version": "E0.6",
    "description": "volcano"
  },
  {
    "code_point": "1F5FB",
    "status": "fully-qualified",
    "icon": "🗻",
    "version": "E0.6",
    "description": "mount fuji"
  },
  {
    "code_point": "1F3D5 FE0F",
    "status": "fully-qualified",
    "icon": "🏕️",
    "version": "E0.7",
    "description": "camping"
  },
  {
    "code_point": "1F3D5",
    "status": "unqualified",
    "icon": "🏕",
    "version": "E0.7",
    "description": "camping"
  },
  {
    "code_point": "1F3D6 FE0F",
    "status": "fully-qualified",
    "icon": "🏖️",
    "version": "E0.7",
    "description": "beach with umbrella"
  },
  {
    "code_point": "1F3D6",
    "status": "unqualified",
    "icon": "🏖",
    "version": "E0.7",
    "description": "beach with umbrella"
  },
  {
    "code_point": "1F3DC FE0F",
    "status": "fully-qualified",
    "icon": "🏜️",
    "version": "E0.7",
    "description": "desert"
  },
  {
    "code_point": "1F3DC",
    "status": "unqualified",
    "icon": "🏜",
    "version": "E0.7",
    "description": "desert"
  },
  {
    "code_point": "1F3DD FE0F",
    "status": "fully-qualified",
    "icon": "🏝️",
    "version": "E0.7",
    "description": "desert island"
  },
  {
    "code_point": "1F3DD",
    "status": "unqualified",
    "icon": "🏝",
    "version": "E0.7",
    "description": "desert island"
  },
  {
    "code_point": "1F3DE FE0F",
    "status": "fully-qualified",
    "icon": "🏞️",
    "version": "E0.7",
    "description": "national park"
  },
  {
    "code_point": "1F3DE",
    "status": "unqualified",
    "icon": "🏞",
    "version": "E0.7",
    "description": "national park"
  },
  {
    "code_point": "1F3DF FE0F",
    "status": "fully-qualified",
    "icon": "🏟️",
    "version": "E0.7",
    "description": "stadium"
  },
  {
    "code_point": "1F3DF",
    "status": "unqualified",
    "icon": "🏟",
    "version": "E0.7",
    "description": "stadium"
  },
  {
    "code_point": "1F3DB FE0F",
    "status": "fully-qualified",
    "icon": "🏛️",
    "version": "E0.7",
    "description": "classical building"
  },
  {
    "code_point": "1F3DB",
    "status": "unqualified",
    "icon": "🏛",
    "version": "E0.7",
    "description": "classical building"
  },
  {
    "code_point": "1F3D7 FE0F",
    "status": "fully-qualified",
    "icon": "🏗️",
    "version": "E0.7",
    "description": "building construction"
  },
  {
    "code_point": "1F3D7",
    "status": "unqualified",
    "icon": "🏗",
    "version": "E0.7",
    "description": "building construction"
  },
  {
    "code_point": "1F9F1",
    "status": "fully-qualified",
    "icon": "🧱",
    "version": "E11.0",
    "description": "brick"
  },
  {
    "code_point": "1FAA8",
    "status": "fully-qualified",
    "icon": "🪨",
    "version": "E13.0",
    "description": "rock"
  },
  {
    "code_point": "1FAB5",
    "status": "fully-qualified",
    "icon": "🪵",
    "version": "E13.0",
    "description": "wood"
  },
  {
    "code_point": "1F6D6",
    "status": "fully-qualified",
    "icon": "🛖",
    "version": "E13.0",
    "description": "hut"
  },
  {
    "code_point": "1F3D8 FE0F",
    "status": "fully-qualified",
    "icon": "🏘️",
    "version": "E0.7",
    "description": "houses"
  },
  {
    "code_point": "1F3D8",
    "status": "unqualified",
    "icon": "🏘",
    "version": "E0.7",
    "description": "houses"
  },
  {
    "code_point": "1F3DA FE0F",
    "status": "fully-qualified",
    "icon": "🏚️",
    "version": "E0.7",
    "description": "derelict house"
  },
  {
    "code_point": "1F3DA",
    "status": "unqualified",
    "icon": "🏚",
    "version": "E0.7",
    "description": "derelict house"
  },
  {
    "code_point": "1F3E0",
    "status": "fully-qualified",
    "icon": "🏠",
    "version": "E0.6",
    "description": "house"
  },
  {
    "code_point": "1F3E1",
    "status": "fully-qualified",
    "icon": "🏡",
    "version": "E0.6",
    "description": "house with garden"
  },
  {
    "code_point": "1F3E2",
    "status": "fully-qualified",
    "icon": "🏢",
    "version": "E0.6",
    "description": "office building"
  },
  {
    "code_point": "1F3E3",
    "status": "fully-qualified",
    "icon": "🏣",
    "version": "E0.6",
    "description": "Japanese post office"
  },
  {
    "code_point": "1F3E4",
    "status": "fully-qualified",
    "icon": "🏤",
    "version": "E1.0",
    "description": "post office"
  },
  {
    "code_point": "1F3E5",
    "status": "fully-qualified",
    "icon": "🏥",
    "version": "E0.6",
    "description": "hospital"
  },
  {
    "code_point": "1F3E6",
    "status": "fully-qualified",
    "icon": "🏦",
    "version": "E0.6",
    "description": "bank"
  },
  {
    "code_point": "1F3E8",
    "status": "fully-qualified",
    "icon": "🏨",
    "version": "E0.6",
    "description": "hotel"
  },
  {
    "code_point": "1F3E9",
    "status": "fully-qualified",
    "icon": "🏩",
    "version": "E0.6",
    "description": "love hotel"
  },
  {
    "code_point": "1F3EA",
    "status": "fully-qualified",
    "icon": "🏪",
    "version": "E0.6",
    "description": "convenience store"
  },
  {
    "code_point": "1F3EB",
    "status": "fully-qualified",
    "icon": "🏫",
    "version": "E0.6",
    "description": "school"
  },
  {
    "code_point": "1F3EC",
    "status": "fully-qualified",
    "icon": "🏬",
    "version": "E0.6",
    "description": "department store"
  },
  {
    "code_point": "1F3ED",
    "status": "fully-qualified",
    "icon": "🏭",
    "version": "E0.6",
    "description": "factory"
  },
  {
    "code_point": "1F3EF",
    "status": "fully-qualified",
    "icon": "🏯",
    "version": "E0.6",
    "description": "Japanese castle"
  },
  {
    "code_point": "1F3F0",
    "status": "fully-qualified",
    "icon": "🏰",
    "version": "E0.6",
    "description": "castle"
  },
  {
    "code_point": "1F492",
    "status": "fully-qualified",
    "icon": "💒",
    "version": "E0.6",
    "description": "wedding"
  },
  {
    "code_point": "1F5FC",
    "status": "fully-qualified",
    "icon": "🗼",
    "version": "E0.6",
    "description": "Tokyo tower"
  },
  {
    "code_point": "1F5FD",
    "status": "fully-qualified",
    "icon": "🗽",
    "version": "E0.6",
    "description": "Statue of Liberty"
  },
  {
    "code_point": "26EA",
    "status": "fully-qualified",
    "icon": "⛪",
    "version": "E0.6",
    "description": "church"
  },
  {
    "code_point": "1F54C",
    "status": "fully-qualified",
    "icon": "🕌",
    "version": "E1.0",
    "description": "mosque"
  },
  {
    "code_point": "1F6D5",
    "status": "fully-qualified",
    "icon": "🛕",
    "version": "E12.0",
    "description": "hindu temple"
  },
  {
    "code_point": "1F54D",
    "status": "fully-qualified",
    "icon": "🕍",
    "version": "E1.0",
    "description": "synagogue"
  },
  {
    "code_point": "26E9 FE0F",
    "status": "fully-qualified",
    "icon": "⛩️",
    "version": "E0.7",
    "description": "shinto shrine"
  },
  {
    "code_point": "26E9",
    "status": "unqualified",
    "icon": "⛩",
    "version": "E0.7",
    "description": "shinto shrine"
  },
  {
    "code_point": "1F54B",
    "status": "fully-qualified",
    "icon": "🕋",
    "version": "E1.0",
    "description": "kaaba"
  },
  {
    "code_point": "26F2",
    "status": "fully-qualified",
    "icon": "⛲",
    "version": "E0.6",
    "description": "fountain"
  },
  {
    "code_point": "26FA",
    "status": "fully-qualified",
    "icon": "⛺",
    "version": "E0.6",
    "description": "tent"
  },
  {
    "code_point": "1F301",
    "status": "fully-qualified",
    "icon": "🌁",
    "version": "E0.6",
    "description": "foggy"
  },
  {
    "code_point": "1F303",
    "status": "fully-qualified",
    "icon": "🌃",
    "version": "E0.6",
    "description": "night with stars"
  },
  {
    "code_point": "1F3D9 FE0F",
    "status": "fully-qualified",
    "icon": "🏙️",
    "version": "E0.7",
    "description": "cityscape"
  },
  {
    "code_point": "1F3D9",
    "status": "unqualified",
    "icon": "🏙",
    "version": "E0.7",
    "description": "cityscape"
  },
  {
    "code_point": "1F304",
    "status": "fully-qualified",
    "icon": "🌄",
    "version": "E0.6",
    "description": "sunrise over mountains"
  },
  {
    "code_point": "1F305",
    "status": "fully-qualified",
    "icon": "🌅",
    "version": "E0.6",
    "description": "sunrise"
  },
  {
    "code_point": "1F306",
    "status": "fully-qualified",
    "icon": "🌆",
    "version": "E0.6",
    "description": "cityscape at dusk"
  },
  {
    "code_point": "1F307",
    "status": "fully-qualified",
    "icon": "🌇",
    "version": "E0.6",
    "description": "sunset"
  },
  {
    "code_point": "1F309",
    "status": "fully-qualified",
    "icon": "🌉",
    "version": "E0.6",
    "description": "bridge at night"
  },
  {
    "code_point": "2668 FE0F",
    "status": "fully-qualified",
    "icon": "♨️",
    "version": "E0.6",
    "description": "hot springs"
  },
  {
    "code_point": "2668",
    "status": "unqualified",
    "icon": "♨",
    "version": "E0.6",
    "description": "hot springs"
  },
  {
    "code_point": "1F3A0",
    "status": "fully-qualified",
    "icon": "🎠",
    "version": "E0.6",
    "description": "carousel horse"
  },
  {
    "code_point": "1F6DD",
    "status": "fully-qualified",
    "icon": "🛝",
    "version": "E14.0",
    "description": "playground slide"
  },
  {
    "code_point": "1F3A1",
    "status": "fully-qualified",
    "icon": "🎡",
    "version": "E0.6",
    "description": "ferris wheel"
  },
  {
    "code_point": "1F3A2",
    "status": "fully-qualified",
    "icon": "🎢",
    "version": "E0.6",
    "description": "roller coaster"
  },
  {
    "code_point": "1F488",
    "status": "fully-qualified",
    "icon": "💈",
    "version": "E0.6",
    "description": "barber pole"
  },
  {
    "code_point": "1F3AA",
    "status": "fully-qualified",
    "icon": "🎪",
    "version": "E0.6",
    "description": "circus tent"
  },
  {
    "code_point": "1F682",
    "status": "fully-qualified",
    "icon": "🚂",
    "version": "E1.0",
    "description": "locomotive"
  },
  {
    "code_point": "1F683",
    "status": "fully-qualified",
    "icon": "🚃",
    "version": "E0.6",
    "description": "railway car"
  },
  {
    "code_point": "1F684",
    "status": "fully-qualified",
    "icon": "🚄",
    "version": "E0.6",
    "description": "high-speed train"
  },
  {
    "code_point": "1F685",
    "status": "fully-qualified",
    "icon": "🚅",
    "version": "E0.6",
    "description": "bullet train"
  },
  {
    "code_point": "1F686",
    "status": "fully-qualified",
    "icon": "🚆",
    "version": "E1.0",
    "description": "train"
  },
  {
    "code_point": "1F687",
    "status": "fully-qualified",
    "icon": "🚇",
    "version": "E0.6",
    "description": "metro"
  },
  {
    "code_point": "1F688",
    "status": "fully-qualified",
    "icon": "🚈",
    "version": "E1.0",
    "description": "light rail"
  },
  {
    "code_point": "1F689",
    "status": "fully-qualified",
    "icon": "🚉",
    "version": "E0.6",
    "description": "station"
  },
  {
    "code_point": "1F68A",
    "status": "fully-qualified",
    "icon": "🚊",
    "version": "E1.0",
    "description": "tram"
  },
  {
    "code_point": "1F69D",
    "status": "fully-qualified",
    "icon": "🚝",
    "version": "E1.0",
    "description": "monorail"
  },
  {
    "code_point": "1F69E",
    "status": "fully-qualified",
    "icon": "🚞",
    "version": "E1.0",
    "description": "mountain railway"
  },
  {
    "code_point": "1F68B",
    "status": "fully-qualified",
    "icon": "🚋",
    "version": "E1.0",
    "description": "tram car"
  },
  {
    "code_point": "1F68C",
    "status": "fully-qualified",
    "icon": "🚌",
    "version": "E0.6",
    "description": "bus"
  },
  {
    "code_point": "1F68D",
    "status": "fully-qualified",
    "icon": "🚍",
    "version": "E0.7",
    "description": "oncoming bus"
  },
  {
    "code_point": "1F68E",
    "status": "fully-qualified",
    "icon": "🚎",
    "version": "E1.0",
    "description": "trolleybus"
  },
  {
    "code_point": "1F690",
    "status": "fully-qualified",
    "icon": "🚐",
    "version": "E1.0",
    "description": "minibus"
  },
  {
    "code_point": "1F691",
    "status": "fully-qualified",
    "icon": "🚑",
    "version": "E0.6",
    "description": "ambulance"
  },
  {
    "code_point": "1F692",
    "status": "fully-qualified",
    "icon": "🚒",
    "version": "E0.6",
    "description": "fire engine"
  },
  {
    "code_point": "1F693",
    "status": "fully-qualified",
    "icon": "🚓",
    "version": "E0.6",
    "description": "police car"
  },
  {
    "code_point": "1F694",
    "status": "fully-qualified",
    "icon": "🚔",
    "version": "E0.7",
    "description": "oncoming police car"
  },
  {
    "code_point": "1F695",
    "status": "fully-qualified",
    "icon": "🚕",
    "version": "E0.6",
    "description": "taxi"
  },
  {
    "code_point": "1F696",
    "status": "fully-qualified",
    "icon": "🚖",
    "version": "E1.0",
    "description": "oncoming taxi"
  },
  {
    "code_point": "1F697",
    "status": "fully-qualified",
    "icon": "🚗",
    "version": "E0.6",
    "description": "automobile"
  },
  {
    "code_point": "1F698",
    "status": "fully-qualified",
    "icon": "🚘",
    "version": "E0.7",
    "description": "oncoming automobile"
  },
  {
    "code_point": "1F699",
    "status": "fully-qualified",
    "icon": "🚙",
    "version": "E0.6",
    "description": "sport utility vehicle"
  },
  {
    "code_point": "1F6FB",
    "status": "fully-qualified",
    "icon": "🛻",
    "version": "E13.0",
    "description": "pickup truck"
  },
  {
    "code_point": "1F69A",
    "status": "fully-qualified",
    "icon": "🚚",
    "version": "E0.6",
    "description": "delivery truck"
  },
  {
    "code_point": "1F69B",
    "status": "fully-qualified",
    "icon": "🚛",
    "version": "E1.0",
    "description": "articulated lorry"
  },
  {
    "code_point": "1F69C",
    "status": "fully-qualified",
    "icon": "🚜",
    "version": "E1.0",
    "description": "tractor"
  },
  {
    "code_point": "1F3CE FE0F",
    "status": "fully-qualified",
    "icon": "🏎️",
    "version": "E0.7",
    "description": "racing car"
  },
  {
    "code_point": "1F3CE",
    "status": "unqualified",
    "icon": "🏎",
    "version": "E0.7",
    "description": "racing car"
  },
  {
    "code_point": "1F3CD FE0F",
    "status": "fully-qualified",
    "icon": "🏍️",
    "version": "E0.7",
    "description": "motorcycle"
  },
  {
    "code_point": "1F3CD",
    "status": "unqualified",
    "icon": "🏍",
    "version": "E0.7",
    "description": "motorcycle"
  },
  {
    "code_point": "1F6F5",
    "status": "fully-qualified",
    "icon": "🛵",
    "version": "E3.0",
    "description": "motor scooter"
  },
  {
    "code_point": "1F9BD",
    "status": "fully-qualified",
    "icon": "🦽",
    "version": "E12.0",
    "description": "manual wheelchair"
  },
  {
    "code_point": "1F9BC",
    "status": "fully-qualified",
    "icon": "🦼",
    "version": "E12.0",
    "description": "motorized wheelchair"
  },
  {
    "code_point": "1F6FA",
    "status": "fully-qualified",
    "icon": "🛺",
    "version": "E12.0",
    "description": "auto rickshaw"
  },
  {
    "code_point": "1F6B2",
    "status": "fully-qualified",
    "icon": "🚲",
    "version": "E0.6",
    "description": "bicycle"
  },
  {
    "code_point": "1F6F4",
    "status": "fully-qualified",
    "icon": "🛴",
    "version": "E3.0",
    "description": "kick scooter"
  },
  {
    "code_point": "1F6F9",
    "status": "fully-qualified",
    "icon": "🛹",
    "version": "E11.0",
    "description": "skateboard"
  },
  {
    "code_point": "1F6FC",
    "status": "fully-qualified",
    "icon": "🛼",
    "version": "E13.0",
    "description": "roller skate"
  },
  {
    "code_point": "1F68F",
    "status": "fully-qualified",
    "icon": "🚏",
    "version": "E0.6",
    "description": "bus stop"
  },
  {
    "code_point": "1F6E3 FE0F",
    "status": "fully-qualified",
    "icon": "🛣️",
    "version": "E0.7",
    "description": "motorway"
  },
  {
    "code_point": "1F6E3",
    "status": "unqualified",
    "icon": "🛣",
    "version": "E0.7",
    "description": "motorway"
  },
  {
    "code_point": "1F6E4 FE0F",
    "status": "fully-qualified",
    "icon": "🛤️",
    "version": "E0.7",
    "description": "railway track"
  },
  {
    "code_point": "1F6E4",
    "status": "unqualified",
    "icon": "🛤",
    "version": "E0.7",
    "description": "railway track"
  },
  {
    "code_point": "1F6E2 FE0F",
    "status": "fully-qualified",
    "icon": "🛢️",
    "version": "E0.7",
    "description": "oil drum"
  },
  {
    "code_point": "1F6E2",
    "status": "unqualified",
    "icon": "🛢",
    "version": "E0.7",
    "description": "oil drum"
  },
  {
    "code_point": "26FD",
    "status": "fully-qualified",
    "icon": "⛽",
    "version": "E0.6",
    "description": "fuel pump"
  },
  {
    "code_point": "1F6DE",
    "status": "fully-qualified",
    "icon": "🛞",
    "version": "E14.0",
    "description": "wheel"
  },
  {
    "code_point": "1F6A8",
    "status": "fully-qualified",
    "icon": "🚨",
    "version": "E0.6",
    "description": "police car light"
  },
  {
    "code_point": "1F6A5",
    "status": "fully-qualified",
    "icon": "🚥",
    "version": "E0.6",
    "description": "horizontal traffic light"
  },
  {
    "code_point": "1F6A6",
    "status": "fully-qualified",
    "icon": "🚦",
    "version": "E1.0",
    "description": "vertical traffic light"
  },
  {
    "code_point": "1F6D1",
    "status": "fully-qualified",
    "icon": "🛑",
    "version": "E3.0",
    "description": "stop sign"
  },
  {
    "code_point": "1F6A7",
    "status": "fully-qualified",
    "icon": "🚧",
    "version": "E0.6",
    "description": "construction"
  },
  {
    "code_point": "2693",
    "status": "fully-qualified",
    "icon": "⚓",
    "version": "E0.6",
    "description": "anchor"
  },
  {
    "code_point": "1F6DF",
    "status": "fully-qualified",
    "icon": "🛟",
    "version": "E14.0",
    "description": "ring buoy"
  },
  {
    "code_point": "26F5",
    "status": "fully-qualified",
    "icon": "⛵",
    "version": "E0.6",
    "description": "sailboat"
  },
  {
    "code_point": "1F6F6",
    "status": "fully-qualified",
    "icon": "🛶",
    "version": "E3.0",
    "description": "canoe"
  },
  {
    "code_point": "1F6A4",
    "status": "fully-qualified",
    "icon": "🚤",
    "version": "E0.6",
    "description": "speedboat"
  },
  {
    "code_point": "1F6F3 FE0F",
    "status": "fully-qualified",
    "icon": "🛳️",
    "version": "E0.7",
    "description": "passenger ship"
  },
  {
    "code_point": "1F6F3",
    "status": "unqualified",
    "icon": "🛳",
    "version": "E0.7",
    "description": "passenger ship"
  },
  {
    "code_point": "26F4 FE0F",
    "status": "fully-qualified",
    "icon": "⛴️",
    "version": "E0.7",
    "description": "ferry"
  },
  {
    "code_point": "26F4",
    "status": "unqualified",
    "icon": "⛴",
    "version": "E0.7",
    "description": "ferry"
  },
  {
    "code_point": "1F6E5 FE0F",
    "status": "fully-qualified",
    "icon": "🛥️",
    "version": "E0.7",
    "description": "motor boat"
  },
  {
    "code_point": "1F6E5",
    "status": "unqualified",
    "icon": "🛥",
    "version": "E0.7",
    "description": "motor boat"
  },
  {
    "code_point": "1F6A2",
    "status": "fully-qualified",
    "icon": "🚢",
    "version": "E0.6",
    "description": "ship"
  },
  {
    "code_point": "2708 FE0F",
    "status": "fully-qualified",
    "icon": "✈️",
    "version": "E0.6",
    "description": "airplane"
  },
  {
    "code_point": "2708",
    "status": "unqualified",
    "icon": "✈",
    "version": "E0.6",
    "description": "airplane"
  },
  {
    "code_point": "1F6E9 FE0F",
    "status": "fully-qualified",
    "icon": "🛩️",
    "version": "E0.7",
    "description": "small airplane"
  },
  {
    "code_point": "1F6E9",
    "status": "unqualified",
    "icon": "🛩",
    "version": "E0.7",
    "description": "small airplane"
  },
  {
    "code_point": "1F6EB",
    "status": "fully-qualified",
    "icon": "🛫",
    "version": "E1.0",
    "description": "airplane departure"
  },
  {
    "code_point": "1F6EC",
    "status": "fully-qualified",
    "icon": "🛬",
    "version": "E1.0",
    "description": "airplane arrival"
  },
  {
    "code_point": "1FA82",
    "status": "fully-qualified",
    "icon": "🪂",
    "version": "E12.0",
    "description": "parachute"
  },
  {
    "code_point": "1F4BA",
    "status": "fully-qualified",
    "icon": "💺",
    "version": "E0.6",
    "description": "seat"
  },
  {
    "code_point": "1F681",
    "status": "fully-qualified",
    "icon": "🚁",
    "version": "E1.0",
    "description": "helicopter"
  },
  {
    "code_point": "1F69F",
    "status": "fully-qualified",
    "icon": "🚟",
    "version": "E1.0",
    "description": "suspension railway"
  },
  {
    "code_point": "1F6A0",
    "status": "fully-qualified",
    "icon": "🚠",
    "version": "E1.0",
    "description": "mountain cableway"
  },
  {
    "code_point": "1F6A1",
    "status": "fully-qualified",
    "icon": "🚡",
    "version": "E1.0",
    "description": "aerial tramway"
  },
  {
    "code_point": "1F6F0 FE0F",
    "status": "fully-qualified",
    "icon": "🛰️",
    "version": "E0.7",
    "description": "satellite"
  },
  {
    "code_point": "1F6F0",
    "status": "unqualified",
    "icon": "🛰",
    "version": "E0.7",
    "description": "satellite"
  },
  {
    "code_point": "1F680",
    "status": "fully-qualified",
    "icon": "🚀",
    "version": "E0.6",
    "description": "rocket"
  },
  {
    "code_point": "1F6F8",
    "status": "fully-qualified",
    "icon": "🛸",
    "version": "E5.0",
    "description": "flying saucer"
  },
  {
    "code_point": "1F6CE FE0F",
    "status": "fully-qualified",
    "icon": "🛎️",
    "version": "E0.7",
    "description": "bellhop bell"
  },
  {
    "code_point": "1F6CE",
    "status": "unqualified",
    "icon": "🛎",
    "version": "E0.7",
    "description": "bellhop bell"
  },
  {
    "code_point": "1F9F3",
    "status": "fully-qualified",
    "icon": "🧳",
    "version": "E11.0",
    "description": "luggage"
  },
  {
    "code_point": "231B",
    "status": "fully-qualified",
    "icon": "⌛",
    "version": "E0.6",
    "description": "hourglass done"
  },
  {
    "code_point": "23F3",
    "status": "fully-qualified",
    "icon": "⏳",
    "version": "E0.6",
    "description": "hourglass not done"
  },
  {
    "code_point": "231A",
    "status": "fully-qualified",
    "icon": "⌚",
    "version": "E0.6",
    "description": "watch"
  },
  {
    "code_point": "23F0",
    "status": "fully-qualified",
    "icon": "⏰",
    "version": "E0.6",
    "description": "alarm clock"
  },
  {
    "code_point": "23F1 FE0F",
    "status": "fully-qualified",
    "icon": "⏱️",
    "version": "E1.0",
    "description": "stopwatch"
  },
  {
    "code_point": "23F1",
    "status": "unqualified",
    "icon": "⏱",
    "version": "E1.0",
    "description": "stopwatch"
  },
  {
    "code_point": "23F2 FE0F",
    "status": "fully-qualified",
    "icon": "⏲️",
    "version": "E1.0",
    "description": "timer clock"
  },
  {
    "code_point": "23F2",
    "status": "unqualified",
    "icon": "⏲",
    "version": "E1.0",
    "description": "timer clock"
  },
  {
    "code_point": "1F570 FE0F",
    "status": "fully-qualified",
    "icon": "🕰️",
    "version": "E0.7",
    "description": "mantelpiece clock"
  },
  {
    "code_point": "1F570",
    "status": "unqualified",
    "icon": "🕰",
    "version": "E0.7",
    "description": "mantelpiece clock"
  },
  {
    "code_point": "1F55B",
    "status": "fully-qualified",
    "icon": "🕛",
    "version": "E0.6",
    "description": "twelve o’clock"
  },
  {
    "code_point": "1F567",
    "status": "fully-qualified",
    "icon": "🕧",
    "version": "E0.7",
    "description": "twelve-thirty"
  },
  {
    "code_point": "1F550",
    "status": "fully-qualified",
    "icon": "🕐",
    "version": "E0.6",
    "description": "one o’clock"
  },
  {
    "code_point": "1F55C",
    "status": "fully-qualified",
    "icon": "🕜",
    "version": "E0.7",
    "description": "one-thirty"
  },
  {
    "code_point": "1F551",
    "status": "fully-qualified",
    "icon": "🕑",
    "version": "E0.6",
    "description": "two o’clock"
  },
  {
    "code_point": "1F55D",
    "status": "fully-qualified",
    "icon": "🕝",
    "version": "E0.7",
    "description": "two-thirty"
  },
  {
    "code_point": "1F552",
    "status": "fully-qualified",
    "icon": "🕒",
    "version": "E0.6",
    "description": "three o’clock"
  },
  {
    "code_point": "1F55E",
    "status": "fully-qualified",
    "icon": "🕞",
    "version": "E0.7",
    "description": "three-thirty"
  },
  {
    "code_point": "1F553",
    "status": "fully-qualified",
    "icon": "🕓",
    "version": "E0.6",
    "description": "four o’clock"
  },
  {
    "code_point": "1F55F",
    "status": "fully-qualified",
    "icon": "🕟",
    "version": "E0.7",
    "description": "four-thirty"
  },
  {
    "code_point": "1F554",
    "status": "fully-qualified",
    "icon": "🕔",
    "version": "E0.6",
    "description": "five o’clock"
  },
  {
    "code_point": "1F560",
    "status": "fully-qualified",
    "icon": "🕠",
    "version": "E0.7",
    "description": "five-thirty"
  },
  {
    "code_point": "1F555",
    "status": "fully-qualified",
    "icon": "🕕",
    "version": "E0.6",
    "description": "six o’clock"
  },
  {
    "code_point": "1F561",
    "status": "fully-qualified",
    "icon": "🕡",
    "version": "E0.7",
    "description": "six-thirty"
  },
  {
    "code_point": "1F556",
    "status": "fully-qualified",
    "icon": "🕖",
    "version": "E0.6",
    "description": "seven o’clock"
  },
  {
    "code_point": "1F562",
    "status": "fully-qualified",
    "icon": "🕢",
    "version": "E0.7",
    "description": "seven-thirty"
  },
  {
    "code_point": "1F557",
    "status": "fully-qualified",
    "icon": "🕗",
    "version": "E0.6",
    "description": "eight o’clock"
  },
  {
    "code_point": "1F563",
    "status": "fully-qualified",
    "icon": "🕣",
    "version": "E0.7",
    "description": "eight-thirty"
  },
  {
    "code_point": "1F558",
    "status": "fully-qualified",
    "icon": "🕘",
    "version": "E0.6",
    "description": "nine o’clock"
  },
  {
    "code_point": "1F564",
    "status": "fully-qualified",
    "icon": "🕤",
    "version": "E0.7",
    "description": "nine-thirty"
  },
  {
    "code_point": "1F559",
    "status": "fully-qualified",
    "icon": "🕙",
    "version": "E0.6",
    "description": "ten o’clock"
  },
  {
    "code_point": "1F565",
    "status": "fully-qualified",
    "icon": "🕥",
    "version": "E0.7",
    "description": "ten-thirty"
  },
  {
    "code_point": "1F55A",
    "status": "fully-qualified",
    "icon": "🕚",
    "version": "E0.6",
    "description": "eleven o’clock"
  },
  {
    "code_point": "1F566",
    "status": "fully-qualified",
    "icon": "🕦",
    "version": "E0.7",
    "description": "eleven-thirty"
  },
  {
    "code_point": "1F311",
    "status": "fully-qualified",
    "icon": "🌑",
    "version": "E0.6",
    "description": "new moon"
  },
  {
    "code_point": "1F312",
    "status": "fully-qualified",
    "icon": "🌒",
    "version": "E1.0",
    "description": "waxing crescent moon"
  },
  {
    "code_point": "1F313",
    "status": "fully-qualified",
    "icon": "🌓",
    "version": "E0.6",
    "description": "first quarter moon"
  },
  {
    "code_point": "1F314",
    "status": "fully-qualified",
    "icon": "🌔",
    "version": "E0.6",
    "description": "waxing gibbous moon"
  },
  {
    "code_point": "1F315",
    "status": "fully-qualified",
    "icon": "🌕",
    "version": "E0.6",
    "description": "full moon"
  },
  {
    "code_point": "1F316",
    "status": "fully-qualified",
    "icon": "🌖",
    "version": "E1.0",
    "description": "waning gibbous moon"
  },
  {
    "code_point": "1F317",
    "status": "fully-qualified",
    "icon": "🌗",
    "version": "E1.0",
    "description": "last quarter moon"
  },
  {
    "code_point": "1F318",
    "status": "fully-qualified",
    "icon": "🌘",
    "version": "E1.0",
    "description": "waning crescent moon"
  },
  {
    "code_point": "1F319",
    "status": "fully-qualified",
    "icon": "🌙",
    "version": "E0.6",
    "description": "crescent moon"
  },
  {
    "code_point": "1F31A",
    "status": "fully-qualified",
    "icon": "🌚",
    "version": "E1.0",
    "description": "new moon face"
  },
  {
    "code_point": "1F31B",
    "status": "fully-qualified",
    "icon": "🌛",
    "version": "E0.6",
    "description": "first quarter moon face"
  },
  {
    "code_point": "1F31C",
    "status": "fully-qualified",
    "icon": "🌜",
    "version": "E0.7",
    "description": "last quarter moon face"
  },
  {
    "code_point": "1F321 FE0F",
    "status": "fully-qualified",
    "icon": "🌡️",
    "version": "E0.7",
    "description": "thermometer"
  },
  {
    "code_point": "1F321",
    "status": "unqualified",
    "icon": "🌡",
    "version": "E0.7",
    "description": "thermometer"
  },
  {
    "code_point": "2600 FE0F",
    "status": "fully-qualified",
    "icon": "☀️",
    "version": "E0.6",
    "description": "sun"
  },
  {
    "code_point": "2600",
    "status": "unqualified",
    "icon": "☀",
    "version": "E0.6",
    "description": "sun"
  },
  {
    "code_point": "1F31D",
    "status": "fully-qualified",
    "icon": "🌝",
    "version": "E1.0",
    "description": "full moon face"
  },
  {
    "code_point": "1F31E",
    "status": "fully-qualified",
    "icon": "🌞",
    "version": "E1.0",
    "description": "sun with face"
  },
  {
    "code_point": "1FA90",
    "status": "fully-qualified",
    "icon": "🪐",
    "version": "E12.0",
    "description": "ringed planet"
  },
  {
    "code_point": "2B50",
    "status": "fully-qualified",
    "icon": "⭐",
    "version": "E0.6",
    "description": "star"
  },
  {
    "code_point": "1F31F",
    "status": "fully-qualified",
    "icon": "🌟",
    "version": "E0.6",
    "description": "glowing star"
  },
  {
    "code_point": "1F320",
    "status": "fully-qualified",
    "icon": "🌠",
    "version": "E0.6",
    "description": "shooting star"
  },
  {
    "code_point": "1F30C",
    "status": "fully-qualified",
    "icon": "🌌",
    "version": "E0.6",
    "description": "milky way"
  },
  {
    "code_point": "2601 FE0F",
    "status": "fully-qualified",
    "icon": "☁️",
    "version": "E0.6",
    "description": "cloud"
  },
  {
    "code_point": "2601",
    "status": "unqualified",
    "icon": "☁",
    "version": "E0.6",
    "description": "cloud"
  },
  {
    "code_point": "26C5",
    "status": "fully-qualified",
    "icon": "⛅",
    "version": "E0.6",
    "description": "sun behind cloud"
  },
  {
    "code_point": "26C8 FE0F",
    "status": "fully-qualified",
    "icon": "⛈️",
    "version": "E0.7",
    "description": "cloud with lightning and rain"
  },
  {
    "code_point": "26C8",
    "status": "unqualified",
    "icon": "⛈",
    "version": "E0.7",
    "description": "cloud with lightning and rain"
  },
  {
    "code_point": "1F324 FE0F",
    "status": "fully-qualified",
    "icon": "🌤️",
    "version": "E0.7",
    "description": "sun behind small cloud"
  },
  {
    "code_point": "1F324",
    "status": "unqualified",
    "icon": "🌤",
    "version": "E0.7",
    "description": "sun behind small cloud"
  },
  {
    "code_point": "1F325 FE0F",
    "status": "fully-qualified",
    "icon": "🌥️",
    "version": "E0.7",
    "description": "sun behind large cloud"
  },
  {
    "code_point": "1F325",
    "status": "unqualified",
    "icon": "🌥",
    "version": "E0.7",
    "description": "sun behind large cloud"
  },
  {
    "code_point": "1F326 FE0F",
    "status": "fully-qualified",
    "icon": "🌦️",
    "version": "E0.7",
    "description": "sun behind rain cloud"
  },
  {
    "code_point": "1F326",
    "status": "unqualified",
    "icon": "🌦",
    "version": "E0.7",
    "description": "sun behind rain cloud"
  },
  {
    "code_point": "1F327 FE0F",
    "status": "fully-qualified",
    "icon": "🌧️",
    "version": "E0.7",
    "description": "cloud with rain"
  },
  {
    "code_point": "1F327",
    "status": "unqualified",
    "icon": "🌧",
    "version": "E0.7",
    "description": "cloud with rain"
  },
  {
    "code_point": "1F328 FE0F",
    "status": "fully-qualified",
    "icon": "🌨️",
    "version": "E0.7",
    "description": "cloud with snow"
  },
  {
    "code_point": "1F328",
    "status": "unqualified",
    "icon": "🌨",
    "version": "E0.7",
    "description": "cloud with snow"
  },
  {
    "code_point": "1F329 FE0F",
    "status": "fully-qualified",
    "icon": "🌩️",
    "version": "E0.7",
    "description": "cloud with lightning"
  },
  {
    "code_point": "1F329",
    "status": "unqualified",
    "icon": "🌩",
    "version": "E0.7",
    "description": "cloud with lightning"
  },
  {
    "code_point": "1F32A FE0F",
    "status": "fully-qualified",
    "icon": "🌪️",
    "version": "E0.7",
    "description": "tornado"
  },
  {
    "code_point": "1F32A",
    "status": "unqualified",
    "icon": "🌪",
    "version": "E0.7",
    "description": "tornado"
  },
  {
    "code_point": "1F32B FE0F",
    "status": "fully-qualified",
    "icon": "🌫️",
    "version": "E0.7",
    "description": "fog"
  },
  {
    "code_point": "1F32B",
    "status": "unqualified",
    "icon": "🌫",
    "version": "E0.7",
    "description": "fog"
  },
  {
    "code_point": "1F32C FE0F",
    "status": "fully-qualified",
    "icon": "🌬️",
    "version": "E0.7",
    "description": "wind face"
  },
  {
    "code_point": "1F32C",
    "status": "unqualified",
    "icon": "🌬",
    "version": "E0.7",
    "description": "wind face"
  },
  {
    "code_point": "1F300",
    "status": "fully-qualified",
    "icon": "🌀",
    "version": "E0.6",
    "description": "cyclone"
  },
  {
    "code_point": "1F308",
    "status": "fully-qualified",
    "icon": "🌈",
    "version": "E0.6",
    "description": "rainbow"
  },
  {
    "code_point": "1F302",
    "status": "fully-qualified",
    "icon": "🌂",
    "version": "E0.6",
    "description": "closed umbrella"
  },
  {
    "code_point": "2602 FE0F",
    "status": "fully-qualified",
    "icon": "☂️",
    "version": "E0.7",
    "description": "umbrella"
  },
  {
    "code_point": "2602",
    "status": "unqualified",
    "icon": "☂",
    "version": "E0.7",
    "description": "umbrella"
  },
  {
    "code_point": "2614",
    "status": "fully-qualified",
    "icon": "☔",
    "version": "E0.6",
    "description": "umbrella with rain drops"
  },
  {
    "code_point": "26F1 FE0F",
    "status": "fully-qualified",
    "icon": "⛱️",
    "version": "E0.7",
    "description": "umbrella on ground"
  },
  {
    "code_point": "26F1",
    "status": "unqualified",
    "icon": "⛱",
    "version": "E0.7",
    "description": "umbrella on ground"
  },
  {
    "code_point": "26A1",
    "status": "fully-qualified",
    "icon": "⚡",
    "version": "E0.6",
    "description": "high voltage"
  },
  {
    "code_point": "2744 FE0F",
    "status": "fully-qualified",
    "icon": "❄️",
    "version": "E0.6",
    "description": "snowflake"
  },
  {
    "code_point": "2744",
    "status": "unqualified",
    "icon": "❄",
    "version": "E0.6",
    "description": "snowflake"
  },
  {
    "code_point": "2603 FE0F",
    "status": "fully-qualified",
    "icon": "☃️",
    "version": "E0.7",
    "description": "snowman"
  },
  {
    "code_point": "2603",
    "status": "unqualified",
    "icon": "☃",
    "version": "E0.7",
    "description": "snowman"
  },
  {
    "code_point": "26C4",
    "status": "fully-qualified",
    "icon": "⛄",
    "version": "E0.6",
    "description": "snowman without snow"
  },
  {
    "code_point": "2604 FE0F",
    "status": "fully-qualified",
    "icon": "☄️",
    "version": "E1.0",
    "description": "comet"
  },
  {
    "code_point": "2604",
    "status": "unqualified",
    "icon": "☄",
    "version": "E1.0",
    "description": "comet"
  },
  {
    "code_point": "1F525",
    "status": "fully-qualified",
    "icon": "🔥",
    "version": "E0.6",
    "description": "fire"
  },
  {
    "code_point": "1F4A7",
    "status": "fully-qualified",
    "icon": "💧",
    "version": "E0.6",
    "description": "droplet"
  },
  {
    "code_point": "1F30A",
    "status": "fully-qualified",
    "icon": "🌊",
    "version": "E0.6",
    "description": "water wave"
  },
  {
    "code_point": "1F383",
    "status": "fully-qualified",
    "icon": "🎃",
    "version": "E0.6",
    "description": "jack-o-lantern"
  },
  {
    "code_point": "1F384",
    "status": "fully-qualified",
    "icon": "🎄",
    "version": "E0.6",
    "description": "Christmas tree"
  },
  {
    "code_point": "1F386",
    "status": "fully-qualified",
    "icon": "🎆",
    "version": "E0.6",
    "description": "fireworks"
  },
  {
    "code_point": "1F387",
    "status": "fully-qualified",
    "icon": "🎇",
    "version": "E0.6",
    "description": "sparkler"
  },
  {
    "code_point": "1F9E8",
    "status": "fully-qualified",
    "icon": "🧨",
    "version": "E11.0",
    "description": "firecracker"
  },
  {
    "code_point": "2728",
    "status": "fully-qualified",
    "icon": "✨",
    "version": "E0.6",
    "description": "sparkles"
  },
  {
    "code_point": "1F388",
    "status": "fully-qualified",
    "icon": "🎈",
    "version": "E0.6",
    "description": "balloon"
  },
  {
    "code_point": "1F389",
    "status": "fully-qualified",
    "icon": "🎉",
    "version": "E0.6",
    "description": "party popper"
  },
  {
    "code_point": "1F38A",
    "status": "fully-qualified",
    "icon": "🎊",
    "version": "E0.6",
    "description": "confetti ball"
  },
  {
    "code_point": "1F38B",
    "status": "fully-qualified",
    "icon": "🎋",
    "version": "E0.6",
    "description": "tanabata tree"
  },
  {
    "code_point": "1F38D",
    "status": "fully-qualified",
    "icon": "🎍",
    "version": "E0.6",
    "description": "pine decoration"
  },
  {
    "code_point": "1F38E",
    "status": "fully-qualified",
    "icon": "🎎",
    "version": "E0.6",
    "description": "Japanese dolls"
  },
  {
    "code_point": "1F38F",
    "status": "fully-qualified",
    "icon": "🎏",
    "version": "E0.6",
    "description": "carp streamer"
  },
  {
    "code_point": "1F390",
    "status": "fully-qualified",
    "icon": "🎐",
    "version": "E0.6",
    "description": "wind chime"
  },
  {
    "code_point": "1F391",
    "status": "fully-qualified",
    "icon": "🎑",
    "version": "E0.6",
    "description": "moon viewing ceremony"
  },
  {
    "code_point": "1F9E7",
    "status": "fully-qualified",
    "icon": "🧧",
    "version": "E11.0",
    "description": "red envelope"
  },
  {
    "code_point": "1F380",
    "status": "fully-qualified",
    "icon": "🎀",
    "version": "E0.6",
    "description": "ribbon"
  },
  {
    "code_point": "1F381",
    "status": "fully-qualified",
    "icon": "🎁",
    "version": "E0.6",
    "description": "wrapped gift"
  },
  {
    "code_point": "1F397 FE0F",
    "status": "fully-qualified",
    "icon": "🎗️",
    "version": "E0.7",
    "description": "reminder ribbon"
  },
  {
    "code_point": "1F397",
    "status": "unqualified",
    "icon": "🎗",
    "version": "E0.7",
    "description": "reminder ribbon"
  },
  {
    "code_point": "1F39F FE0F",
    "status": "fully-qualified",
    "icon": "🎟️",
    "version": "E0.7",
    "description": "admission tickets"
  },
  {
    "code_point": "1F39F",
    "status": "unqualified",
    "icon": "🎟",
    "version": "E0.7",
    "description": "admission tickets"
  },
  {
    "code_point": "1F3AB",
    "status": "fully-qualified",
    "icon": "🎫",
    "version": "E0.6",
    "description": "ticket"
  },
  {
    "code_point": "1F396 FE0F",
    "status": "fully-qualified",
    "icon": "🎖️",
    "version": "E0.7",
    "description": "military medal"
  },
  {
    "code_point": "1F396",
    "status": "unqualified",
    "icon": "🎖",
    "version": "E0.7",
    "description": "military medal"
  },
  {
    "code_point": "1F3C6",
    "status": "fully-qualified",
    "icon": "🏆",
    "version": "E0.6",
    "description": "trophy"
  },
  {
    "code_point": "1F3C5",
    "status": "fully-qualified",
    "icon": "🏅",
    "version": "E1.0",
    "description": "sports medal"
  },
  {
    "code_point": "1F947",
    "status": "fully-qualified",
    "icon": "🥇",
    "version": "E3.0",
    "description": "1st place medal"
  },
  {
    "code_point": "1F948",
    "status": "fully-qualified",
    "icon": "🥈",
    "version": "E3.0",
    "description": "2nd place medal"
  },
  {
    "code_point": "1F949",
    "status": "fully-qualified",
    "icon": "🥉",
    "version": "E3.0",
    "description": "3rd place medal"
  },
  {
    "code_point": "26BD",
    "status": "fully-qualified",
    "icon": "⚽",
    "version": "E0.6",
    "description": "soccer ball"
  },
  {
    "code_point": "26BE",
    "status": "fully-qualified",
    "icon": "⚾",
    "version": "E0.6",
    "description": "baseball"
  },
  {
    "code_point": "1F94E",
    "status": "fully-qualified",
    "icon": "🥎",
    "version": "E11.0",
    "description": "softball"
  },
  {
    "code_point": "1F3C0",
    "status": "fully-qualified",
    "icon": "🏀",
    "version": "E0.6",
    "description": "basketball"
  },
  {
    "code_point": "1F3D0",
    "status": "fully-qualified",
    "icon": "🏐",
    "version": "E1.0",
    "description": "volleyball"
  },
  {
    "code_point": "1F3C8",
    "status": "fully-qualified",
    "icon": "🏈",
    "version": "E0.6",
    "description": "american football"
  },
  {
    "code_point": "1F3C9",
    "status": "fully-qualified",
    "icon": "🏉",
    "version": "E1.0",
    "description": "rugby football"
  },
  {
    "code_point": "1F3BE",
    "status": "fully-qualified",
    "icon": "🎾",
    "version": "E0.6",
    "description": "tennis"
  },
  {
    "code_point": "1F94F",
    "status": "fully-qualified",
    "icon": "🥏",
    "version": "E11.0",
    "description": "flying disc"
  },
  {
    "code_point": "1F3B3",
    "status": "fully-qualified",
    "icon": "🎳",
    "version": "E0.6",
    "description": "bowling"
  },
  {
    "code_point": "1F3CF",
    "status": "fully-qualified",
    "icon": "🏏",
    "version": "E1.0",
    "description": "cricket game"
  },
  {
    "code_point": "1F3D1",
    "status": "fully-qualified",
    "icon": "🏑",
    "version": "E1.0",
    "description": "field hockey"
  },
  {
    "code_point": "1F3D2",
    "status": "fully-qualified",
    "icon": "🏒",
    "version": "E1.0",
    "description": "ice hockey"
  },
  {
    "code_point": "1F94D",
    "status": "fully-qualified",
    "icon": "🥍",
    "version": "E11.0",
    "description": "lacrosse"
  },
  {
    "code_point": "1F3D3",
    "status": "fully-qualified",
    "icon": "🏓",
    "version": "E1.0",
    "description": "ping pong"
  },
  {
    "code_point": "1F3F8",
    "status": "fully-qualified",
    "icon": "🏸",
    "version": "E1.0",
    "description": "badminton"
  },
  {
    "code_point": "1F94A",
    "status": "fully-qualified",
    "icon": "🥊",
    "version": "E3.0",
    "description": "boxing glove"
  },
  {
    "code_point": "1F94B",
    "status": "fully-qualified",
    "icon": "🥋",
    "version": "E3.0",
    "description": "martial arts uniform"
  },
  {
    "code_point": "1F945",
    "status": "fully-qualified",
    "icon": "🥅",
    "version": "E3.0",
    "description": "goal net"
  },
  {
    "code_point": "26F3",
    "status": "fully-qualified",
    "icon": "⛳",
    "version": "E0.6",
    "description": "flag in hole"
  },
  {
    "code_point": "26F8 FE0F",
    "status": "fully-qualified",
    "icon": "⛸️",
    "version": "E0.7",
    "description": "ice skate"
  },
  {
    "code_point": "26F8",
    "status": "unqualified",
    "icon": "⛸",
    "version": "E0.7",
    "description": "ice skate"
  },
  {
    "code_point": "1F3A3",
    "status": "fully-qualified",
    "icon": "🎣",
    "version": "E0.6",
    "description": "fishing pole"
  },
  {
    "code_point": "1F93F",
    "status": "fully-qualified",
    "icon": "🤿",
    "version": "E12.0",
    "description": "diving mask"
  },
  {
    "code_point": "1F3BD",
    "status": "fully-qualified",
    "icon": "🎽",
    "version": "E0.6",
    "description": "running shirt"
  },
  {
    "code_point": "1F3BF",
    "status": "fully-qualified",
    "icon": "🎿",
    "version": "E0.6",
    "description": "skis"
  },
  {
    "code_point": "1F6F7",
    "status": "fully-qualified",
    "icon": "🛷",
    "version": "E5.0",
    "description": "sled"
  },
  {
    "code_point": "1F94C",
    "status": "fully-qualified",
    "icon": "🥌",
    "version": "E5.0",
    "description": "curling stone"
  },
  {
    "code_point": "1F3AF",
    "status": "fully-qualified",
    "icon": "🎯",
    "version": "E0.6",
    "description": "bullseye"
  },
  {
    "code_point": "1FA80",
    "status": "fully-qualified",
    "icon": "🪀",
    "version": "E12.0",
    "description": "yo-yo"
  },
  {
    "code_point": "1FA81",
    "status": "fully-qualified",
    "icon": "🪁",
    "version": "E12.0",
    "description": "kite"
  },
  {
    "code_point": "1F52B",
    "status": "fully-qualified",
    "icon": "🔫",
    "version": "E0.6",
    "description": "water pistol"
  },
  {
    "code_point": "1F3B1",
    "status": "fully-qualified",
    "icon": "🎱",
    "version": "E0.6",
    "description": "pool 8 ball"
  },
  {
    "code_point": "1F52E",
    "status": "fully-qualified",
    "icon": "🔮",
    "version": "E0.6",
    "description": "crystal ball"
  },
  {
    "code_point": "1FA84",
    "status": "fully-qualified",
    "icon": "🪄",
    "version": "E13.0",
    "description": "magic wand"
  },
  {
    "code_point": "1F3AE",
    "status": "fully-qualified",
    "icon": "🎮",
    "version": "E0.6",
    "description": "video game"
  },
  {
    "code_point": "1F579 FE0F",
    "status": "fully-qualified",
    "icon": "🕹️",
    "version": "E0.7",
    "description": "joystick"
  },
  {
    "code_point": "1F579",
    "status": "unqualified",
    "icon": "🕹",
    "version": "E0.7",
    "description": "joystick"
  },
  {
    "code_point": "1F3B0",
    "status": "fully-qualified",
    "icon": "🎰",
    "version": "E0.6",
    "description": "slot machine"
  },
  {
    "code_point": "1F3B2",
    "status": "fully-qualified",
    "icon": "🎲",
    "version": "E0.6",
    "description": "game die"
  },
  {
    "code_point": "1F9E9",
    "status": "fully-qualified",
    "icon": "🧩",
    "version": "E11.0",
    "description": "puzzle piece"
  },
  {
    "code_point": "1F9F8",
    "status": "fully-qualified",
    "icon": "🧸",
    "version": "E11.0",
    "description": "teddy bear"
  },
  {
    "code_point": "1FA85",
    "status": "fully-qualified",
    "icon": "🪅",
    "version": "E13.0",
    "description": "piñata"
  },
  {
    "code_point": "1FAA9",
    "status": "fully-qualified",
    "icon": "🪩",
    "version": "E14.0",
    "description": "mirror ball"
  },
  {
    "code_point": "1FA86",
    "status": "fully-qualified",
    "icon": "🪆",
    "version": "E13.0",
    "description": "nesting dolls"
  },
  {
    "code_point": "2660 FE0F",
    "status": "fully-qualified",
    "icon": "♠️",
    "version": "E0.6",
    "description": "spade suit"
  },
  {
    "code_point": "2660",
    "status": "unqualified",
    "icon": "♠",
    "version": "E0.6",
    "description": "spade suit"
  },
  {
    "code_point": "2665 FE0F",
    "status": "fully-qualified",
    "icon": "♥️",
    "version": "E0.6",
    "description": "heart suit"
  },
  {
    "code_point": "2665",
    "status": "unqualified",
    "icon": "♥",
    "version": "E0.6",
    "description": "heart suit"
  },
  {
    "code_point": "2666 FE0F",
    "status": "fully-qualified",
    "icon": "♦️",
    "version": "E0.6",
    "description": "diamond suit"
  },
  {
    "code_point": "2666",
    "status": "unqualified",
    "icon": "♦",
    "version": "E0.6",
    "description": "diamond suit"
  },
  {
    "code_point": "2663 FE0F",
    "status": "fully-qualified",
    "icon": "♣️",
    "version": "E0.6",
    "description": "club suit"
  },
  {
    "code_point": "2663",
    "status": "unqualified",
    "icon": "♣",
    "version": "E0.6",
    "description": "club suit"
  },
  {
    "code_point": "265F FE0F",
    "status": "fully-qualified",
    "icon": "♟️",
    "version": "E11.0",
    "description": "chess pawn"
  },
  {
    "code_point": "265F",
    "status": "unqualified",
    "icon": "♟",
    "version": "E11.0",
    "description": "chess pawn"
  },
  {
    "code_point": "1F0CF",
    "status": "fully-qualified",
    "icon": "🃏",
    "version": "E0.6",
    "description": "joker"
  },
  {
    "code_point": "1F004",
    "status": "fully-qualified",
    "icon": "🀄",
    "version": "E0.6",
    "description": "mahjong red dragon"
  },
  {
    "code_point": "1F3B4",
    "status": "fully-qualified",
    "icon": "🎴",
    "version": "E0.6",
    "description": "flower playing cards"
  },
  {
    "code_point": "1F3AD",
    "status": "fully-qualified",
    "icon": "🎭",
    "version": "E0.6",
    "description": "performing arts"
  },
  {
    "code_point": "1F5BC FE0F",
    "status": "fully-qualified",
    "icon": "🖼️",
    "version": "E0.7",
    "description": "framed picture"
  },
  {
    "code_point": "1F5BC",
    "status": "unqualified",
    "icon": "🖼",
    "version": "E0.7",
    "description": "framed picture"
  },
  {
    "code_point": "1F3A8",
    "status": "fully-qualified",
    "icon": "🎨",
    "version": "E0.6",
    "description": "artist palette"
  },
  {
    "code_point": "1F9F5",
    "status": "fully-qualified",
    "icon": "🧵",
    "version": "E11.0",
    "description": "thread"
  },
  {
    "code_point": "1FAA1",
    "status": "fully-qualified",
    "icon": "🪡",
    "version": "E13.0",
    "description": "sewing needle"
  },
  {
    "code_point": "1F9F6",
    "status": "fully-qualified",
    "icon": "🧶",
    "version": "E11.0",
    "description": "yarn"
  },
  {
    "code_point": "1FAA2",
    "status": "fully-qualified",
    "icon": "🪢",
    "version": "E13.0",
    "description": "knot"
  },
  {
    "code_point": "1F453",
    "status": "fully-qualified",
    "icon": "👓",
    "version": "E0.6",
    "description": "glasses"
  },
  {
    "code_point": "1F576 FE0F",
    "status": "fully-qualified",
    "icon": "🕶️",
    "version": "E0.7",
    "description": "sunglasses"
  },
  {
    "code_point": "1F576",
    "status": "unqualified",
    "icon": "🕶",
    "version": "E0.7",
    "description": "sunglasses"
  },
  {
    "code_point": "1F97D",
    "status": "fully-qualified",
    "icon": "🥽",
    "version": "E11.0",
    "description": "goggles"
  },
  {
    "code_point": "1F97C",
    "status": "fully-qualified",
    "icon": "🥼",
    "version": "E11.0",
    "description": "lab coat"
  },
  {
    "code_point": "1F9BA",
    "status": "fully-qualified",
    "icon": "🦺",
    "version": "E12.0",
    "description": "safety vest"
  },
  {
    "code_point": "1F454",
    "status": "fully-qualified",
    "icon": "👔",
    "version": "E0.6",
    "description": "necktie"
  },
  {
    "code_point": "1F455",
    "status": "fully-qualified",
    "icon": "👕",
    "version": "E0.6",
    "description": "t-shirt"
  },
  {
    "code_point": "1F456",
    "status": "fully-qualified",
    "icon": "👖",
    "version": "E0.6",
    "description": "jeans"
  },
  {
    "code_point": "1F9E3",
    "status": "fully-qualified",
    "icon": "🧣",
    "version": "E5.0",
    "description": "scarf"
  },
  {
    "code_point": "1F9E4",
    "status": "fully-qualified",
    "icon": "🧤",
    "version": "E5.0",
    "description": "gloves"
  },
  {
    "code_point": "1F9E5",
    "status": "fully-qualified",
    "icon": "🧥",
    "version": "E5.0",
    "description": "coat"
  },
  {
    "code_point": "1F9E6",
    "status": "fully-qualified",
    "icon": "🧦",
    "version": "E5.0",
    "description": "socks"
  },
  {
    "code_point": "1F457",
    "status": "fully-qualified",
    "icon": "👗",
    "version": "E0.6",
    "description": "dress"
  },
  {
    "code_point": "1F458",
    "status": "fully-qualified",
    "icon": "👘",
    "version": "E0.6",
    "description": "kimono"
  },
  {
    "code_point": "1F97B",
    "status": "fully-qualified",
    "icon": "🥻",
    "version": "E12.0",
    "description": "sari"
  },
  {
    "code_point": "1FA71",
    "status": "fully-qualified",
    "icon": "🩱",
    "version": "E12.0",
    "description": "one-piece swimsuit"
  },
  {
    "code_point": "1FA72",
    "status": "fully-qualified",
    "icon": "🩲",
    "version": "E12.0",
    "description": "briefs"
  },
  {
    "code_point": "1FA73",
    "status": "fully-qualified",
    "icon": "🩳",
    "version": "E12.0",
    "description": "shorts"
  },
  {
    "code_point": "1F459",
    "status": "fully-qualified",
    "icon": "👙",
    "version": "E0.6",
    "description": "bikini"
  },
  {
    "code_point": "1F45A",
    "status": "fully-qualified",
    "icon": "👚",
    "version": "E0.6",
    "description": "woman’s clothes"
  },
  {
    "code_point": "1FAAD",
    "status": "fully-qualified",
    "icon": "🪭",
    "version": "E15.0",
    "description": "folding hand fan"
  },
  {
    "code_point": "1F45B",
    "status": "fully-qualified",
    "icon": "👛",
    "version": "E0.6",
    "description": "purse"
  },
  {
    "code_point": "1F45C",
    "status": "fully-qualified",
    "icon": "👜",
    "version": "E0.6",
    "description": "handbag"
  },
  {
    "code_point": "1F45D",
    "status": "fully-qualified",
    "icon": "👝",
    "version": "E0.6",
    "description": "clutch bag"
  },
  {
    "code_point": "1F6CD FE0F",
    "status": "fully-qualified",
    "icon": "🛍️",
    "version": "E0.7",
    "description": "shopping bags"
  },
  {
    "code_point": "1F6CD",
    "status": "unqualified",
    "icon": "🛍",
    "version": "E0.7",
    "description": "shopping bags"
  },
  {
    "code_point": "1F392",
    "status": "fully-qualified",
    "icon": "🎒",
    "version": "E0.6",
    "description": "backpack"
  },
  {
    "code_point": "1FA74",
    "status": "fully-qualified",
    "icon": "🩴",
    "version": "E13.0",
    "description": "thong sandal"
  },
  {
    "code_point": "1F45E",
    "status": "fully-qualified",
    "icon": "👞",
    "version": "E0.6",
    "description": "man’s shoe"
  },
  {
    "code_point": "1F45F",
    "status": "fully-qualified",
    "icon": "👟",
    "version": "E0.6",
    "description": "running shoe"
  },
  {
    "code_point": "1F97E",
    "status": "fully-qualified",
    "icon": "🥾",
    "version": "E11.0",
    "description": "hiking boot"
  },
  {
    "code_point": "1F97F",
    "status": "fully-qualified",
    "icon": "🥿",
    "version": "E11.0",
    "description": "flat shoe"
  },
  {
    "code_point": "1F460",
    "status": "fully-qualified",
    "icon": "👠",
    "version": "E0.6",
    "description": "high-heeled shoe"
  },
  {
    "code_point": "1F461",
    "status": "fully-qualified",
    "icon": "👡",
    "version": "E0.6",
    "description": "woman’s sandal"
  },
  {
    "code_point": "1FA70",
    "status": "fully-qualified",
    "icon": "🩰",
    "version": "E12.0",
    "description": "ballet shoes"
  },
  {
    "code_point": "1F462",
    "status": "fully-qualified",
    "icon": "👢",
    "version": "E0.6",
    "description": "woman’s boot"
  },
  {
    "code_point": "1FAAE",
    "status": "fully-qualified",
    "icon": "🪮",
    "version": "E15.0",
    "description": "hair pick"
  },
  {
    "code_point": "1F451",
    "status": "fully-qualified",
    "icon": "👑",
    "version": "E0.6",
    "description": "crown"
  },
  {
    "code_point": "1F452",
    "status": "fully-qualified",
    "icon": "👒",
    "version": "E0.6",
    "description": "woman’s hat"
  },
  {
    "code_point": "1F3A9",
    "status": "fully-qualified",
    "icon": "🎩",
    "version": "E0.6",
    "description": "top hat"
  },
  {
    "code_point": "1F393",
    "status": "fully-qualified",
    "icon": "🎓",
    "version": "E0.6",
    "description": "graduation cap"
  },
  {
    "code_point": "1F9E2",
    "status": "fully-qualified",
    "icon": "🧢",
    "version": "E5.0",
    "description": "billed cap"
  },
  {
    "code_point": "1FA96",
    "status": "fully-qualified",
    "icon": "🪖",
    "version": "E13.0",
    "description": "military helmet"
  },
  {
    "code_point": "26D1 FE0F",
    "status": "fully-qualified",
    "icon": "⛑️",
    "version": "E0.7",
    "description": "rescue worker’s helmet"
  },
  {
    "code_point": "26D1",
    "status": "unqualified",
    "icon": "⛑",
    "version": "E0.7",
    "description": "rescue worker’s helmet"
  },
  {
    "code_point": "1F4FF",
    "status": "fully-qualified",
    "icon": "📿",
    "version": "E1.0",
    "description": "prayer beads"
  },
  {
    "code_point": "1F484",
    "status": "fully-qualified",
    "icon": "💄",
    "version": "E0.6",
    "description": "lipstick"
  },
  {
    "code_point": "1F48D",
    "status": "fully-qualified",
    "icon": "💍",
    "version": "E0.6",
    "description": "ring"
  },
  {
    "code_point": "1F48E",
    "status": "fully-qualified",
    "icon": "💎",
    "version": "E0.6",
    "description": "gem stone"
  },
  {
    "code_point": "1F507",
    "status": "fully-qualified",
    "icon": "🔇",
    "version": "E1.0",
    "description": "muted speaker"
  },
  {
    "code_point": "1F508",
    "status": "fully-qualified",
    "icon": "🔈",
    "version": "E0.7",
    "description": "speaker low volume"
  },
  {
    "code_point": "1F509",
    "status": "fully-qualified",
    "icon": "🔉",
    "version": "E1.0",
    "description": "speaker medium volume"
  },
  {
    "code_point": "1F50A",
    "status": "fully-qualified",
    "icon": "🔊",
    "version": "E0.6",
    "description": "speaker high volume"
  },
  {
    "code_point": "1F4E2",
    "status": "fully-qualified",
    "icon": "📢",
    "version": "E0.6",
    "description": "loudspeaker"
  },
  {
    "code_point": "1F4E3",
    "status": "fully-qualified",
    "icon": "📣",
    "version": "E0.6",
    "description": "megaphone"
  },
  {
    "code_point": "1F4EF",
    "status": "fully-qualified",
    "icon": "📯",
    "version": "E1.0",
    "description": "postal horn"
  },
  {
    "code_point": "1F514",
    "status": "fully-qualified",
    "icon": "🔔",
    "version": "E0.6",
    "description": "bell"
  },
  {
    "code_point": "1F515",
    "status": "fully-qualified",
    "icon": "🔕",
    "version": "E1.0",
    "description": "bell with slash"
  },
  {
    "code_point": "1F3BC",
    "status": "fully-qualified",
    "icon": "🎼",
    "version": "E0.6",
    "description": "musical score"
  },
  {
    "code_point": "1F3B5",
    "status": "fully-qualified",
    "icon": "🎵",
    "version": "E0.6",
    "description": "musical note"
  },
  {
    "code_point": "1F3B6",
    "status": "fully-qualified",
    "icon": "🎶",
    "version": "E0.6",
    "description": "musical notes"
  },
  {
    "code_point": "1F399 FE0F",
    "status": "fully-qualified",
    "icon": "🎙️",
    "version": "E0.7",
    "description": "studio microphone"
  },
  {
    "code_point": "1F399",
    "status": "unqualified",
    "icon": "🎙",
    "version": "E0.7",
    "description": "studio microphone"
  },
  {
    "code_point": "1F39A FE0F",
    "status": "fully-qualified",
    "icon": "🎚️",
    "version": "E0.7",
    "description": "level slider"
  },
  {
    "code_point": "1F39A",
    "status": "unqualified",
    "icon": "🎚",
    "version": "E0.7",
    "description": "level slider"
  },
  {
    "code_point": "1F39B FE0F",
    "status": "fully-qualified",
    "icon": "🎛️",
    "version": "E0.7",
    "description": "control knobs"
  },
  {
    "code_point": "1F39B",
    "status": "unqualified",
    "icon": "🎛",
    "version": "E0.7",
    "description": "control knobs"
  },
  {
    "code_point": "1F3A4",
    "status": "fully-qualified",
    "icon": "🎤",
    "version": "E0.6",
    "description": "microphone"
  },
  {
    "code_point": "1F3A7",
    "status": "fully-qualified",
    "icon": "🎧",
    "version": "E0.6",
    "description": "headphone"
  },
  {
    "code_point": "1F4FB",
    "status": "fully-qualified",
    "icon": "📻",
    "version": "E0.6",
    "description": "radio"
  },
  {
    "code_point": "1F3B7",
    "status": "fully-qualified",
    "icon": "🎷",
    "version": "E0.6",
    "description": "saxophone"
  },
  {
    "code_point": "1FA97",
    "status": "fully-qualified",
    "icon": "🪗",
    "version": "E13.0",
    "description": "accordion"
  },
  {
    "code_point": "1F3B8",
    "status": "fully-qualified",
    "icon": "🎸",
    "version": "E0.6",
    "description": "guitar"
  },
  {
    "code_point": "1F3B9",
    "status": "fully-qualified",
    "icon": "🎹",
    "version": "E0.6",
    "description": "musical keyboard"
  },
  {
    "code_point": "1F3BA",
    "status": "fully-qualified",
    "icon": "🎺",
    "version": "E0.6",
    "description": "trumpet"
  },
  {
    "code_point": "1F3BB",
    "status": "fully-qualified",
    "icon": "🎻",
    "version": "E0.6",
    "description": "violin"
  },
  {
    "code_point": "1FA95",
    "status": "fully-qualified",
    "icon": "🪕",
    "version": "E12.0",
    "description": "banjo"
  },
  {
    "code_point": "1F941",
    "status": "fully-qualified",
    "icon": "🥁",
    "version": "E3.0",
    "description": "drum"
  },
  {
    "code_point": "1FA98",
    "status": "fully-qualified",
    "icon": "🪘",
    "version": "E13.0",
    "description": "long drum"
  },
  {
    "code_point": "1FA87",
    "status": "fully-qualified",
    "icon": "🪇",
    "version": "E15.0",
    "description": "maracas"
  },
  {
    "code_point": "1FA88",
    "status": "fully-qualified",
    "icon": "🪈",
    "version": "E15.0",
    "description": "flute"
  },
  {
    "code_point": "1FA89",
    "status": "fully-qualified",
    "icon": "🪉",
    "version": "E16.0",
    "description": "harp"
  },
  {
    "code_point": "1F4F1",
    "status": "fully-qualified",
    "icon": "📱",
    "version": "E0.6",
    "description": "mobile phone"
  },
  {
    "code_point": "1F4F2",
    "status": "fully-qualified",
    "icon": "📲",
    "version": "E0.6",
    "description": "mobile phone with arrow"
  },
  {
    "code_point": "260E FE0F",
    "status": "fully-qualified",
    "icon": "☎️",
    "version": "E0.6",
    "description": "telephone"
  },
  {
    "code_point": "260E",
    "status": "unqualified",
    "icon": "☎",
    "version": "E0.6",
    "description": "telephone"
  },
  {
    "code_point": "1F4DE",
    "status": "fully-qualified",
    "icon": "📞",
    "version": "E0.6",
    "description": "telephone receiver"
  },
  {
    "code_point": "1F4DF",
    "status": "fully-qualified",
    "icon": "📟",
    "version": "E0.6",
    "description": "pager"
  },
  {
    "code_point": "1F4E0",
    "status": "fully-qualified",
    "icon": "📠",
    "version": "E0.6",
    "description": "fax machine"
  },
  {
    "code_point": "1F50B",
    "status": "fully-qualified",
    "icon": "🔋",
    "version": "E0.6",
    "description": "battery"
  },
  {
    "code_point": "1FAAB",
    "status": "fully-qualified",
    "icon": "🪫",
    "version": "E14.0",
    "description": "low battery"
  },
  {
    "code_point": "1F50C",
    "status": "fully-qualified",
    "icon": "🔌",
    "version": "E0.6",
    "description": "electric plug"
  },
  {
    "code_point": "1F4BB",
    "status": "fully-qualified",
    "icon": "💻",
    "version": "E0.6",
    "description": "laptop"
  },
  {
    "code_point": "1F5A5 FE0F",
    "status": "fully-qualified",
    "icon": "🖥️",
    "version": "E0.7",
    "description": "desktop computer"
  },
  {
    "code_point": "1F5A5",
    "status": "unqualified",
    "icon": "🖥",
    "version": "E0.7",
    "description": "desktop computer"
  },
  {
    "code_point": "1F5A8 FE0F",
    "status": "fully-qualified",
    "icon": "🖨️",
    "version": "E0.7",
    "description": "printer"
  },
  {
    "code_point": "1F5A8",
    "status": "unqualified",
    "icon": "🖨",
    "version": "E0.7",
    "description": "printer"
  },
  {
    "code_point": "2328 FE0F",
    "status": "fully-qualified",
    "icon": "⌨️",
    "version": "E1.0",
    "description": "keyboard"
  },
  {
    "code_point": "2328",
    "status": "unqualified",
    "icon": "⌨",
    "version": "E1.0",
    "description": "keyboard"
  },
  {
    "code_point": "1F5B1 FE0F",
    "status": "fully-qualified",
    "icon": "🖱️",
    "version": "E0.7",
    "description": "computer mouse"
  },
  {
    "code_point": "1F5B1",
    "status": "unqualified",
    "icon": "🖱",
    "version": "E0.7",
    "description": "computer mouse"
  },
  {
    "code_point": "1F5B2 FE0F",
    "status": "fully-qualified",
    "icon": "🖲️",
    "version": "E0.7",
    "description": "trackball"
  },
  {
    "code_point": "1F5B2",
    "status": "unqualified",
    "icon": "🖲",
    "version": "E0.7",
    "description": "trackball"
  },
  {
    "code_point": "1F4BD",
    "status": "fully-qualified",
    "icon": "💽",
    "version": "E0.6",
    "description": "computer disk"
  },
  {
    "code_point": "1F4BE",
    "status": "fully-qualified",
    "icon": "💾",
    "version": "E0.6",
    "description": "floppy disk"
  },
  {
    "code_point": "1F4BF",
    "status": "fully-qualified",
    "icon": "💿",
    "version": "E0.6",
    "description": "optical disk"
  },
  {
    "code_point": "1F4C0",
    "status": "fully-qualified",
    "icon": "📀",
    "version": "E0.6",
    "description": "dvd"
  },
  {
    "code_point": "1F9EE",
    "status": "fully-qualified",
    "icon": "🧮",
    "version": "E11.0",
    "description": "abacus"
  },
  {
    "code_point": "1F3A5",
    "status": "fully-qualified",
    "icon": "🎥",
    "version": "E0.6",
    "description": "movie camera"
  },
  {
    "code_point": "1F39E FE0F",
    "status": "fully-qualified",
    "icon": "🎞️",
    "version": "E0.7",
    "description": "film frames"
  },
  {
    "code_point": "1F39E",
    "status": "unqualified",
    "icon": "🎞",
    "version": "E0.7",
    "description": "film frames"
  },
  {
    "code_point": "1F4FD FE0F",
    "status": "fully-qualified",
    "icon": "📽️",
    "version": "E0.7",
    "description": "film projector"
  },
  {
    "code_point": "1F4FD",
    "status": "unqualified",
    "icon": "📽",
    "version": "E0.7",
    "description": "film projector"
  },
  {
    "code_point": "1F3AC",
    "status": "fully-qualified",
    "icon": "🎬",
    "version": "E0.6",
    "description": "clapper board"
  },
  {
    "code_point": "1F4FA",
    "status": "fully-qualified",
    "icon": "📺",
    "version": "E0.6",
    "description": "television"
  },
  {
    "code_point": "1F4F7",
    "status": "fully-qualified",
    "icon": "📷",
    "version": "E0.6",
    "description": "camera"
  },
  {
    "code_point": "1F4F8",
    "status": "fully-qualified",
    "icon": "📸",
    "version": "E1.0",
    "description": "camera with flash"
  },
  {
    "code_point": "1F4F9",
    "status": "fully-qualified",
    "icon": "📹",
    "version": "E0.6",
    "description": "video camera"
  },
  {
    "code_point": "1F4FC",
    "status": "fully-qualified",
    "icon": "📼",
    "version": "E0.6",
    "description": "videocassette"
  },
  {
    "code_point": "1F50D",
    "status": "fully-qualified",
    "icon": "🔍",
    "version": "E0.6",
    "description": "magnifying glass tilted left"
  },
  {
    "code_point": "1F50E",
    "status": "fully-qualified",
    "icon": "🔎",
    "version": "E0.6",
    "description": "magnifying glass tilted right"
  },
  {
    "code_point": "1F56F FE0F",
    "status": "fully-qualified",
    "icon": "🕯️",
    "version": "E0.7",
    "description": "candle"
  },
  {
    "code_point": "1F56F",
    "status": "unqualified",
    "icon": "🕯",
    "version": "E0.7",
    "description": "candle"
  },
  {
    "code_point": "1F4A1",
    "status": "fully-qualified",
    "icon": "💡",
    "version": "E0.6",
    "description": "light bulb"
  },
  {
    "code_point": "1F526",
    "status": "fully-qualified",
    "icon": "🔦",
    "version": "E0.6",
    "description": "flashlight"
  },
  {
    "code_point": "1F3EE",
    "status": "fully-qualified",
    "icon": "🏮",
    "version": "E0.6",
    "description": "red paper lantern"
  },
  {
    "code_point": "1FA94",
    "status": "fully-qualified",
    "icon": "🪔",
    "version": "E12.0",
    "description": "diya lamp"
  },
  {
    "code_point": "1F4D4",
    "status": "fully-qualified",
    "icon": "📔",
    "version": "E0.6",
    "description": "notebook with decorative cover"
  },
  {
    "code_point": "1F4D5",
    "status": "fully-qualified",
    "icon": "📕",
    "version": "E0.6",
    "description": "closed book"
  },
  {
    "code_point": "1F4D6",
    "status": "fully-qualified",
    "icon": "📖",
    "version": "E0.6",
    "description": "open book"
  },
  {
    "code_point": "1F4D7",
    "status": "fully-qualified",
    "icon": "📗",
    "version": "E0.6",
    "description": "green book"
  },
  {
    "code_point": "1F4D8",
    "status": "fully-qualified",
    "icon": "📘",
    "version": "E0.6",
    "description": "blue book"
  },
  {
    "code_point": "1F4D9",
    "status": "fully-qualified",
    "icon": "📙",
    "version": "E0.6",
    "description": "orange book"
  },
  {
    "code_point": "1F4DA",
    "status": "fully-qualified",
    "icon": "📚",
    "version": "E0.6",
    "description": "books"
  },
  {
    "code_point": "1F4D3",
    "status": "fully-qualified",
    "icon": "📓",
    "version": "E0.6",
    "description": "notebook"
  },
  {
    "code_point": "1F4D2",
    "status": "fully-qualified",
    "icon": "📒",
    "version": "E0.6",
    "description": "ledger"
  },
  {
    "code_point": "1F4C3",
    "status": "fully-qualified",
    "icon": "📃",
    "version": "E0.6",
    "description": "page with curl"
  },
  {
    "code_point": "1F4DC",
    "status": "fully-qualified",
    "icon": "📜",
    "version": "E0.6",
    "description": "scroll"
  },
  {
    "code_point": "1F4C4",
    "status": "fully-qualified",
    "icon": "📄",
    "version": "E0.6",
    "description": "page facing up"
  },
  {
    "code_point": "1F4F0",
    "status": "fully-qualified",
    "icon": "📰",
    "version": "E0.6",
    "description": "newspaper"
  },
  {
    "code_point": "1F5DE FE0F",
    "status": "fully-qualified",
    "icon": "🗞️",
    "version": "E0.7",
    "description": "rolled-up newspaper"
  },
  {
    "code_point": "1F5DE",
    "status": "unqualified",
    "icon": "🗞",
    "version": "E0.7",
    "description": "rolled-up newspaper"
  },
  {
    "code_point": "1F4D1",
    "status": "fully-qualified",
    "icon": "📑",
    "version": "E0.6",
    "description": "bookmark tabs"
  },
  {
    "code_point": "1F516",
    "status": "fully-qualified",
    "icon": "🔖",
    "version": "E0.6",
    "description": "bookmark"
  },
  {
    "code_point": "1F3F7 FE0F",
    "status": "fully-qualified",
    "icon": "🏷️",
    "version": "E0.7",
    "description": "label"
  },
  {
    "code_point": "1F3F7",
    "status": "unqualified",
    "icon": "🏷",
    "version": "E0.7",
    "description": "label"
  },
  {
    "code_point": "1F4B0",
    "status": "fully-qualified",
    "icon": "💰",
    "version": "E0.6",
    "description": "money bag"
  },
  {
    "code_point": "1FA99",
    "status": "fully-qualified",
    "icon": "🪙",
    "version": "E13.0",
    "description": "coin"
  },
  {
    "code_point": "1F4B4",
    "status": "fully-qualified",
    "icon": "💴",
    "version": "E0.6",
    "description": "yen banknote"
  },
  {
    "code_point": "1F4B5",
    "status": "fully-qualified",
    "icon": "💵",
    "version": "E0.6",
    "description": "dollar banknote"
  },
  {
    "code_point": "1F4B6",
    "status": "fully-qualified",
    "icon": "💶",
    "version": "E1.0",
    "description": "euro banknote"
  },
  {
    "code_point": "1F4B7",
    "status": "fully-qualified",
    "icon": "💷",
    "version": "E1.0",
    "description": "pound banknote"
  },
  {
    "code_point": "1F4B8",
    "status": "fully-qualified",
    "icon": "💸",
    "version": "E0.6",
    "description": "money with wings"
  },
  {
    "code_point": "1F4B3",
    "status": "fully-qualified",
    "icon": "💳",
    "version": "E0.6",
    "description": "credit card"
  },
  {
    "code_point": "1F9FE",
    "status": "fully-qualified",
    "icon": "🧾",
    "version": "E11.0",
    "description": "receipt"
  },
  {
    "code_point": "1F4B9",
    "status": "fully-qualified",
    "icon": "💹",
    "version": "E0.6",
    "description": "chart increasing with yen"
  },
  {
    "code_point": "2709 FE0F",
    "status": "fully-qualified",
    "icon": "✉️",
    "version": "E0.6",
    "description": "envelope"
  },
  {
    "code_point": "2709",
    "status": "unqualified",
    "icon": "✉",
    "version": "E0.6",
    "description": "envelope"
  },
  {
    "code_point": "1F4E7",
    "status": "fully-qualified",
    "icon": "📧",
    "version": "E0.6",
    "description": "e-mail"
  },
  {
    "code_point": "1F4E8",
    "status": "fully-qualified",
    "icon": "📨",
    "version": "E0.6",
    "description": "incoming envelope"
  },
  {
    "code_point": "1F4E9",
    "status": "fully-qualified",
    "icon": "📩",
    "version": "E0.6",
    "description": "envelope with arrow"
  },
  {
    "code_point": "1F4E4",
    "status": "fully-qualified",
    "icon": "📤",
    "version": "E0.6",
    "description": "outbox tray"
  },
  {
    "code_point": "1F4E5",
    "status": "fully-qualified",
    "icon": "📥",
    "version": "E0.6",
    "description": "inbox tray"
  },
  {
    "code_point": "1F4E6",
    "status": "fully-qualified",
    "icon": "📦",
    "version": "E0.6",
    "description": "package"
  },
  {
    "code_point": "1F4EB",
    "status": "fully-qualified",
    "icon": "📫",
    "version": "E0.6",
    "description": "closed mailbox with raised flag"
  },
  {
    "code_point": "1F4EA",
    "status": "fully-qualified",
    "icon": "📪",
    "version": "E0.6",
    "description": "closed mailbox with lowered flag"
  },
  {
    "code_point": "1F4EC",
    "status": "fully-qualified",
    "icon": "📬",
    "version": "E0.7",
    "description": "open mailbox with raised flag"
  },
  {
    "code_point": "1F4ED",
    "status": "fully-qualified",
    "icon": "📭",
    "version": "E0.7",
    "description": "open mailbox with lowered flag"
  },
  {
    "code_point": "1F4EE",
    "status": "fully-qualified",
    "icon": "📮",
    "version": "E0.6",
    "description": "postbox"
  },
  {
    "code_point": "1F5F3 FE0F",
    "status": "fully-qualified",
    "icon": "🗳️",
    "version": "E0.7",
    "description": "ballot box with ballot"
  },
  {
    "code_point": "1F5F3",
    "status": "unqualified",
    "icon": "🗳",
    "version": "E0.7",
    "description": "ballot box with ballot"
  },
  {
    "code_point": "270F FE0F",
    "status": "fully-qualified",
    "icon": "✏️",
    "version": "E0.6",
    "description": "pencil"
  },
  {
    "code_point": "270F",
    "status": "unqualified",
    "icon": "✏",
    "version": "E0.6",
    "description": "pencil"
  },
  {
    "code_point": "2712 FE0F",
    "status": "fully-qualified",
    "icon": "✒️",
    "version": "E0.6",
    "description": "black nib"
  },
  {
    "code_point": "2712",
    "status": "unqualified",
    "icon": "✒",
    "version": "E0.6",
    "description": "black nib"
  },
  {
    "code_point": "1F58B FE0F",
    "status": "fully-qualified",
    "icon": "🖋️",
    "version": "E0.7",
    "description": "fountain pen"
  },
  {
    "code_point": "1F58B",
    "status": "unqualified",
    "icon": "🖋",
    "version": "E0.7",
    "description": "fountain pen"
  },
  {
    "code_point": "1F58A FE0F",
    "status": "fully-qualified",
    "icon": "🖊️",
    "version": "E0.7",
    "description": "pen"
  },
  {
    "code_point": "1F58A",
    "status": "unqualified",
    "icon": "🖊",
    "version": "E0.7",
    "description": "pen"
  },
  {
    "code_point": "1F58C FE0F",
    "status": "fully-qualified",
    "icon": "🖌️",
    "version": "E0.7",
    "description": "paintbrush"
  },
  {
    "code_point": "1F58C",
    "status": "unqualified",
    "icon": "🖌",
    "version": "E0.7",
    "description": "paintbrush"
  },
  {
    "code_point": "1F58D FE0F",
    "status": "fully-qualified",
    "icon": "🖍️",
    "version": "E0.7",
    "description": "crayon"
  },
  {
    "code_point": "1F58D",
    "status": "unqualified",
    "icon": "🖍",
    "version": "E0.7",
    "description": "crayon"
  },
  {
    "code_point": "1F4DD",
    "status": "fully-qualified",
    "icon": "📝",
    "version": "E0.6",
    "description": "memo"
  },
  {
    "code_point": "1F4BC",
    "status": "fully-qualified",
    "icon": "💼",
    "version": "E0.6",
    "description": "briefcase"
  },
  {
    "code_point": "1F4C1",
    "status": "fully-qualified",
    "icon": "📁",
    "version": "E0.6",
    "description": "file folder"
  },
  {
    "code_point": "1F4C2",
    "status": "fully-qualified",
    "icon": "📂",
    "version": "E0.6",
    "description": "open file folder"
  },
  {
    "code_point": "1F5C2 FE0F",
    "status": "fully-qualified",
    "icon": "🗂️",
    "version": "E0.7",
    "description": "card index dividers"
  },
  {
    "code_point": "1F5C2",
    "status": "unqualified",
    "icon": "🗂",
    "version": "E0.7",
    "description": "card index dividers"
  },
  {
    "code_point": "1F4C5",
    "status": "fully-qualified",
    "icon": "📅",
    "version": "E0.6",
    "description": "calendar"
  },
  {
    "code_point": "1F4C6",
    "status": "fully-qualified",
    "icon": "📆",
    "version": "E0.6",
    "description": "tear-off calendar"
  },
  {
    "code_point": "1F5D2 FE0F",
    "status": "fully-qualified",
    "icon": "🗒️",
    "version": "E0.7",
    "description": "spiral notepad"
  },
  {
    "code_point": "1F5D2",
    "status": "unqualified",
    "icon": "🗒",
    "version": "E0.7",
    "description": "spiral notepad"
  },
  {
    "code_point": "1F5D3 FE0F",
    "status": "fully-qualified",
    "icon": "🗓️",
    "version": "E0.7",
    "description": "spiral calendar"
  },
  {
    "code_point": "1F5D3",
    "status": "unqualified",
    "icon": "🗓",
    "version": "E0.7",
    "description": "spiral calendar"
  },
  {
    "code_point": "1F4C7",
    "status": "fully-qualified",
    "icon": "📇",
    "version": "E0.6",
    "description": "card index"
  },
  {
    "code_point": "1F4C8",
    "status": "fully-qualified",
    "icon": "📈",
    "version": "E0.6",
    "description": "chart increasing"
  },
  {
    "code_point": "1F4C9",
    "status": "fully-qualified",
    "icon": "📉",
    "version": "E0.6",
    "description": "chart decreasing"
  },
  {
    "code_point": "1F4CA",
    "status": "fully-qualified",
    "icon": "📊",
    "version": "E0.6",
    "description": "bar chart"
  },
  {
    "code_point": "1F4CB",
    "status": "fully-qualified",
    "icon": "📋",
    "version": "E0.6",
    "description": "clipboard"
  },
  {
    "code_point": "1F4CC",
    "status": "fully-qualified",
    "icon": "📌",
    "version": "E0.6",
    "description": "pushpin"
  },
  {
    "code_point": "1F4CD",
    "status": "fully-qualified",
    "icon": "📍",
    "version": "E0.6",
    "description": "round pushpin"
  },
  {
    "code_point": "1F4CE",
    "status": "fully-qualified",
    "icon": "📎",
    "version": "E0.6",
    "description": "paperclip"
  },
  {
    "code_point": "1F587 FE0F",
    "status": "fully-qualified",
    "icon": "🖇️",
    "version": "E0.7",
    "description": "linked paperclips"
  },
  {
    "code_point": "1F587",
    "status": "unqualified",
    "icon": "🖇",
    "version": "E0.7",
    "description": "linked paperclips"
  },
  {
    "code_point": "1F4CF",
    "status": "fully-qualified",
    "icon": "📏",
    "version": "E0.6",
    "description": "straight ruler"
  },
  {
    "code_point": "1F4D0",
    "status": "fully-qualified",
    "icon": "📐",
    "version": "E0.6",
    "description": "triangular ruler"
  },
  {
    "code_point": "2702 FE0F",
    "status": "fully-qualified",
    "icon": "✂️",
    "version": "E0.6",
    "description": "scissors"
  },
  {
    "code_point": "2702",
    "status": "unqualified",
    "icon": "✂",
    "version": "E0.6",
    "description": "scissors"
  },
  {
    "code_point": "1F5C3 FE0F",
    "status": "fully-qualified",
    "icon": "🗃️",
    "version": "E0.7",
    "description": "card file box"
  },
  {
    "code_point": "1F5C3",
    "status": "unqualified",
    "icon": "🗃",
    "version": "E0.7",
    "description": "card file box"
  },
  {
    "code_point": "1F5C4 FE0F",
    "status": "fully-qualified",
    "icon": "🗄️",
    "version": "E0.7",
    "description": "file cabinet"
  },
  {
    "code_point": "1F5C4",
    "status": "unqualified",
    "icon": "🗄",
    "version": "E0.7",
    "description": "file cabinet"
  },
  {
    "code_point": "1F5D1 FE0F",
    "status": "fully-qualified",
    "icon": "🗑️",
    "version": "E0.7",
    "description": "wastebasket"
  },
  {
    "code_point": "1F5D1",
    "status": "unqualified",
    "icon": "🗑",
    "version": "E0.7",
    "description": "wastebasket"
  },
  {
    "code_point": "1F512",
    "status": "fully-qualified",
    "icon": "🔒",
    "version": "E0.6",
    "description": "locked"
  },
  {
    "code_point": "1F513",
    "status": "fully-qualified",
    "icon": "🔓",
    "version": "E0.6",
    "description": "unlocked"
  },
  {
    "code_point": "1F50F",
    "status": "fully-qualified",
    "icon": "🔏",
    "version": "E0.6",
    "description": "locked with pen"
  },
  {
    "code_point": "1F510",
    "status": "fully-qualified",
    "icon": "🔐",
    "version": "E0.6",
    "description": "locked with key"
  },
  {
    "code_point": "1F511",
    "status": "fully-qualified",
    "icon": "🔑",
    "version": "E0.6",
    "description": "key"
  },
  {
    "code_point": "1F5DD FE0F",
    "status": "fully-qualified",
    "icon": "🗝️",
    "version": "E0.7",
    "description": "old key"
  },
  {
    "code_point": "1F5DD",
    "status": "unqualified",
    "icon": "🗝",
    "version": "E0.7",
    "description": "old key"
  },
  {
    "code_point": "1F528",
    "status": "fully-qualified",
    "icon": "🔨",
    "version": "E0.6",
    "description": "hammer"
  },
  {
    "code_point": "1FA93",
    "status": "fully-qualified",
    "icon": "🪓",
    "version": "E12.0",
    "description": "axe"
  },
  {
    "code_point": "26CF FE0F",
    "status": "fully-qualified",
    "icon": "⛏️",
    "version": "E0.7",
    "description": "pick"
  },
  {
    "code_point": "26CF",
    "status": "unqualified",
    "icon": "⛏",
    "version": "E0.7",
    "description": "pick"
  },
  {
    "code_point": "2692 FE0F",
    "status": "fully-qualified",
    "icon": "⚒️",
    "version": "E1.0",
    "description": "hammer and pick"
  },
  {
    "code_point": "2692",
    "status": "unqualified",
    "icon": "⚒",
    "version": "E1.0",
    "description": "hammer and pick"
  },
  {
    "code_point": "1F6E0 FE0F",
    "status": "fully-qualified",
    "icon": "🛠️",
    "version": "E0.7",
    "description": "hammer and wrench"
  },
  {
    "code_point": "1F6E0",
    "status": "unqualified",
    "icon": "🛠",
    "version": "E0.7",
    "description": "hammer and wrench"
  },
  {
    "code_point": "1F5E1 FE0F",
    "status": "fully-qualified",
    "icon": "🗡️",
    "version": "E0.7",
    "description": "dagger"
  },
  {
    "code_point": "1F5E1",
    "status": "unqualified",
    "icon": "🗡",
    "version": "E0.7",
    "description": "dagger"
  },
  {
    "code_point": "2694 FE0F",
    "status": "fully-qualified",
    "icon": "⚔️",
    "version": "E1.0",
    "description": "crossed swords"
  },
  {
    "code_point": "2694",
    "status": "unqualified",
    "icon": "⚔",
    "version": "E1.0",
    "description": "crossed swords"
  },
  {
    "code_point": "1F4A3",
    "status": "fully-qualified",
    "icon": "💣",
    "version": "E0.6",
    "description": "bomb"
  },
  {
    "code_point": "1FA83",
    "status": "fully-qualified",
    "icon": "🪃",
    "version": "E13.0",
    "description": "boomerang"
  },
  {
    "code_point": "1F3F9",
    "status": "fully-qualified",
    "icon": "🏹",
    "version": "E1.0",
    "description": "bow and arrow"
  },
  {
    "code_point": "1F6E1 FE0F",
    "status": "fully-qualified",
    "icon": "🛡️",
    "version": "E0.7",
    "description": "shield"
  },
  {
    "code_point": "1F6E1",
    "status": "unqualified",
    "icon": "🛡",
    "version": "E0.7",
    "description": "shield"
  },
  {
    "code_point": "1FA9A",
    "status": "fully-qualified",
    "icon": "🪚",
    "version": "E13.0",
    "description": "carpentry saw"
  },
  {
    "code_point": "1F527",
    "status": "fully-qualified",
    "icon": "🔧",
    "version": "E0.6",
    "description": "wrench"
  },
  {
    "code_point": "1FA9B",
    "status": "fully-qualified",
    "icon": "🪛",
    "version": "E13.0",
    "description": "screwdriver"
  },
  {
    "code_point": "1F529",
    "status": "fully-qualified",
    "icon": "🔩",
    "version": "E0.6",
    "description": "nut and bolt"
  },
  {
    "code_point": "2699 FE0F",
    "status": "fully-qualified",
    "icon": "⚙️",
    "version": "E1.0",
    "description": "gear"
  },
  {
    "code_point": "2699",
    "status": "unqualified",
    "icon": "⚙",
    "version": "E1.0",
    "description": "gear"
  },
  {
    "code_point": "1F5DC FE0F",
    "status": "fully-qualified",
    "icon": "🗜️",
    "version": "E0.7",
    "description": "clamp"
  },
  {
    "code_point": "1F5DC",
    "status": "unqualified",
    "icon": "🗜",
    "version": "E0.7",
    "description": "clamp"
  },
  {
    "code_point": "2696 FE0F",
    "status": "fully-qualified",
    "icon": "⚖️",
    "version": "E1.0",
    "description": "balance scale"
  },
  {
    "code_point": "2696",
    "status": "unqualified",
    "icon": "⚖",
    "version": "E1.0",
    "description": "balance scale"
  },
  {
    "code_point": "1F9AF",
    "status": "fully-qualified",
    "icon": "🦯",
    "version": "E12.0",
    "description": "white cane"
  },
  {
    "code_point": "1F517",
    "status": "fully-qualified",
    "icon": "🔗",
    "version": "E0.6",
    "description": "link"
  },
  {
    "code_point": "26D3 FE0F 200D 1F4A5",
    "status": "fully-qualified",
    "icon": "⛓️‍💥",
    "version": "E15.1",
    "description": "broken chain"
  },
  {
    "code_point": "26D3 200D 1F4A5",
    "status": "unqualified",
    "icon": "⛓‍💥",
    "version": "E15.1",
    "description": "broken chain"
  },
  {
    "code_point": "26D3 FE0F",
    "status": "fully-qualified",
    "icon": "⛓️",
    "version": "E0.7",
    "description": "chains"
  },
  {
    "code_point": "26D3",
    "status": "unqualified",
    "icon": "⛓",
    "version": "E0.7",
    "description": "chains"
  },
  {
    "code_point": "1FA9D",
    "status": "fully-qualified",
    "icon": "🪝",
    "version": "E13.0",
    "description": "hook"
  },
  {
    "code_point": "1F9F0",
    "status": "fully-qualified",
    "icon": "🧰",
    "version": "E11.0",
    "description": "toolbox"
  },
  {
    "code_point": "1F9F2",
    "status": "fully-qualified",
    "icon": "🧲",
    "version": "E11.0",
    "description": "magnet"
  },
  {
    "code_point": "1FA9C",
    "status": "fully-qualified",
    "icon": "🪜",
    "version": "E13.0",
    "description": "ladder"
  },
  {
    "code_point": "1FA8F",
    "status": "fully-qualified",
    "icon": "🪏",
    "version": "E16.0",
    "description": "shovel"
  },
  {
    "code_point": "2697 FE0F",
    "status": "fully-qualified",
    "icon": "⚗️",
    "version": "E1.0",
    "description": "alembic"
  },
  {
    "code_point": "2697",
    "status": "unqualified",
    "icon": "⚗",
    "version": "E1.0",
    "description": "alembic"
  },
  {
    "code_point": "1F9EA",
    "status": "fully-qualified",
    "icon": "🧪",
    "version": "E11.0",
    "description": "test tube"
  },
  {
    "code_point": "1F9EB",
    "status": "fully-qualified",
    "icon": "🧫",
    "version": "E11.0",
    "description": "petri dish"
  },
  {
    "code_point": "1F9EC",
    "status": "fully-qualified",
    "icon": "🧬",
    "version": "E11.0",
    "description": "dna"
  },
  {
    "code_point": "1F52C",
    "status": "fully-qualified",
    "icon": "🔬",
    "version": "E1.0",
    "description": "microscope"
  },
  {
    "code_point": "1F52D",
    "status": "fully-qualified",
    "icon": "🔭",
    "version": "E1.0",
    "description": "telescope"
  },
  {
    "code_point": "1F4E1",
    "status": "fully-qualified",
    "icon": "📡",
    "version": "E0.6",
    "description": "satellite antenna"
  },
  {
    "code_point": "1F489",
    "status": "fully-qualified",
    "icon": "💉",
    "version": "E0.6",
    "description": "syringe"
  },
  {
    "code_point": "1FA78",
    "status": "fully-qualified",
    "icon": "🩸",
    "version": "E12.0",
    "description": "drop of blood"
  },
  {
    "code_point": "1F48A",
    "status": "fully-qualified",
    "icon": "💊",
    "version": "E0.6",
    "description": "pill"
  },
  {
    "code_point": "1FA79",
    "status": "fully-qualified",
    "icon": "🩹",
    "version": "E12.0",
    "description": "adhesive bandage"
  },
  {
    "code_point": "1FA7C",
    "status": "fully-qualified",
    "icon": "🩼",
    "version": "E14.0",
    "description": "crutch"
  },
  {
    "code_point": "1FA7A",
    "status": "fully-qualified",
    "icon": "🩺",
    "version": "E12.0",
    "description": "stethoscope"
  },
  {
    "code_point": "1FA7B",
    "status": "fully-qualified",
    "icon": "🩻",
    "version": "E14.0",
    "description": "x-ray"
  },
  {
    "code_point": "1F6AA",
    "status": "fully-qualified",
    "icon": "🚪",
    "version": "E0.6",
    "description": "door"
  },
  {
    "code_point": "1F6D7",
    "status": "fully-qualified",
    "icon": "🛗",
    "version": "E13.0",
    "description": "elevator"
  },
  {
    "code_point": "1FA9E",
    "status": "fully-qualified",
    "icon": "🪞",
    "version": "E13.0",
    "description": "mirror"
  },
  {
    "code_point": "1FA9F",
    "status": "fully-qualified",
    "icon": "🪟",
    "version": "E13.0",
    "description": "window"
  },
  {
    "code_point": "1F6CF FE0F",
    "status": "fully-qualified",
    "icon": "🛏️",
    "version": "E0.7",
    "description": "bed"
  },
  {
    "code_point": "1F6CF",
    "status": "unqualified",
    "icon": "🛏",
    "version": "E0.7",
    "description": "bed"
  },
  {
    "code_point": "1F6CB FE0F",
    "status": "fully-qualified",
    "icon": "🛋️",
    "version": "E0.7",
    "description": "couch and lamp"
  },
  {
    "code_point": "1F6CB",
    "status": "unqualified",
    "icon": "🛋",
    "version": "E0.7",
    "description": "couch and lamp"
  },
  {
    "code_point": "1FA91",
    "status": "fully-qualified",
    "icon": "🪑",
    "version": "E12.0",
    "description": "chair"
  },
  {
    "code_point": "1F6BD",
    "status": "fully-qualified",
    "icon": "🚽",
    "version": "E0.6",
    "description": "toilet"
  },
  {
    "code_point": "1FAA0",
    "status": "fully-qualified",
    "icon": "🪠",
    "version": "E13.0",
    "description": "plunger"
  },
  {
    "code_point": "1F6BF",
    "status": "fully-qualified",
    "icon": "🚿",
    "version": "E1.0",
    "description": "shower"
  },
  {
    "code_point": "1F6C1",
    "status": "fully-qualified",
    "icon": "🛁",
    "version": "E1.0",
    "description": "bathtub"
  },
  {
    "code_point": "1FAA4",
    "status": "fully-qualified",
    "icon": "🪤",
    "version": "E13.0",
    "description": "mouse trap"
  },
  {
    "code_point": "1FA92",
    "status": "fully-qualified",
    "icon": "🪒",
    "version": "E12.0",
    "description": "razor"
  },
  {
    "code_point": "1F9F4",
    "status": "fully-qualified",
    "icon": "🧴",
    "version": "E11.0",
    "description": "lotion bottle"
  },
  {
    "code_point": "1F9F7",
    "status": "fully-qualified",
    "icon": "🧷",
    "version": "E11.0",
    "description": "safety pin"
  },
  {
    "code_point": "1F9F9",
    "status": "fully-qualified",
    "icon": "🧹",
    "version": "E11.0",
    "description": "broom"
  },
  {
    "code_point": "1F9FA",
    "status": "fully-qualified",
    "icon": "🧺",
    "version": "E11.0",
    "description": "basket"
  },
  {
    "code_point": "1F9FB",
    "status": "fully-qualified",
    "icon": "🧻",
    "version": "E11.0",
    "description": "roll of paper"
  },
  {
    "code_point": "1FAA3",
    "status": "fully-qualified",
    "icon": "🪣",
    "version": "E13.0",
    "description": "bucket"
  },
  {
    "code_point": "1F9FC",
    "status": "fully-qualified",
    "icon": "🧼",
    "version": "E11.0",
    "description": "soap"
  },
  {
    "code_point": "1FAE7",
    "status": "fully-qualified",
    "icon": "🫧",
    "version": "E14.0",
    "description": "bubbles"
  },
  {
    "code_point": "1FAA5",
    "status": "fully-qualified",
    "icon": "🪥",
    "version": "E13.0",
    "description": "toothbrush"
  },
  {
    "code_point": "1F9FD",
    "status": "fully-qualified",
    "icon": "🧽",
    "version": "E11.0",
    "description": "sponge"
  },
  {
    "code_point": "1F9EF",
    "status": "fully-qualified",
    "icon": "🧯",
    "version": "E11.0",
    "description": "fire extinguisher"
  },
  {
    "code_point": "1F6D2",
    "status": "fully-qualified",
    "icon": "🛒",
    "version": "E3.0",
    "description": "shopping cart"
  },
  {
    "code_point": "1F6AC",
    "status": "fully-qualified",
    "icon": "🚬",
    "version": "E0.6",
    "description": "cigarette"
  },
  {
    "code_point": "26B0 FE0F",
    "status": "fully-qualified",
    "icon": "⚰️",
    "version": "E1.0",
    "description": "coffin"
  },
  {
    "code_point": "26B0",
    "status": "unqualified",
    "icon": "⚰",
    "version": "E1.0",
    "description": "coffin"
  },
  {
    "code_point": "1FAA6",
    "status": "fully-qualified",
    "icon": "🪦",
    "version": "E13.0",
    "description": "headstone"
  },
  {
    "code_point": "26B1 FE0F",
    "status": "fully-qualified",
    "icon": "⚱️",
    "version": "E1.0",
    "description": "funeral urn"
  },
  {
    "code_point": "26B1",
    "status": "unqualified",
    "icon": "⚱",
    "version": "E1.0",
    "description": "funeral urn"
  },
  {
    "code_point": "1F9FF",
    "status": "fully-qualified",
    "icon": "🧿",
    "version": "E11.0",
    "description": "nazar amulet"
  },
  {
    "code_point": "1FAAC",
    "status": "fully-qualified",
    "icon": "🪬",
    "version": "E14.0",
    "description": "hamsa"
  },
  {
    "code_point": "1F5FF",
    "status": "fully-qualified",
    "icon": "🗿",
    "version": "E0.6",
    "description": "moai"
  },
  {
    "code_point": "1FAA7",
    "status": "fully-qualified",
    "icon": "🪧",
    "version": "E13.0",
    "description": "placard"
  },
  {
    "code_point": "1FAAA",
    "status": "fully-qualified",
    "icon": "🪪",
    "version": "E14.0",
    "description": "identification card"
  },
  {
    "code_point": "1F3E7",
    "status": "fully-qualified",
    "icon": "🏧",
    "version": "E0.6",
    "description": "ATM sign"
  },
  {
    "code_point": "1F6AE",
    "status": "fully-qualified",
    "icon": "🚮",
    "version": "E1.0",
    "description": "litter in bin sign"
  },
  {
    "code_point": "1F6B0",
    "status": "fully-qualified",
    "icon": "🚰",
    "version": "E1.0",
    "description": "potable water"
  },
  {
    "code_point": "267F",
    "status": "fully-qualified",
    "icon": "♿",
    "version": "E0.6",
    "description": "wheelchair symbol"
  },
  {
    "code_point": "1F6B9",
    "status": "fully-qualified",
    "icon": "🚹",
    "version": "E0.6",
    "description": "men’s room"
  },
  {
    "code_point": "1F6BA",
    "status": "fully-qualified",
    "icon": "🚺",
    "version": "E0.6",
    "description": "women’s room"
  },
  {
    "code_point": "1F6BB",
    "status": "fully-qualified",
    "icon": "🚻",
    "version": "E0.6",
    "description": "restroom"
  },
  {
    "code_point": "1F6BC",
    "status": "fully-qualified",
    "icon": "🚼",
    "version": "E0.6",
    "description": "baby symbol"
  },
  {
    "code_point": "1F6BE",
    "status": "fully-qualified",
    "icon": "🚾",
    "version": "E0.6",
    "description": "water closet"
  },
  {
    "code_point": "1F6C2",
    "status": "fully-qualified",
    "icon": "🛂",
    "version": "E1.0",
    "description": "passport control"
  },
  {
    "code_point": "1F6C3",
    "status": "fully-qualified",
    "icon": "🛃",
    "version": "E1.0",
    "description": "customs"
  },
  {
    "code_point": "1F6C4",
    "status": "fully-qualified",
    "icon": "🛄",
    "version": "E1.0",
    "description": "baggage claim"
  },
  {
    "code_point": "1F6C5",
    "status": "fully-qualified",
    "icon": "🛅",
    "version": "E1.0",
    "description": "left luggage"
  },
  {
    "code_point": "26A0 FE0F",
    "status": "fully-qualified",
    "icon": "⚠️",
    "version": "E0.6",
    "description": "warning"
  },
  {
    "code_point": "26A0",
    "status": "unqualified",
    "icon": "⚠",
    "version": "E0.6",
    "description": "warning"
  },
  {
    "code_point": "1F6B8",
    "status": "fully-qualified",
    "icon": "🚸",
    "version": "E1.0",
    "description": "children crossing"
  },
  {
    "code_point": "26D4",
    "status": "fully-qualified",
    "icon": "⛔",
    "version": "E0.6",
    "description": "no entry"
  },
  {
    "code_point": "1F6AB",
    "status": "fully-qualified",
    "icon": "🚫",
    "version": "E0.6",
    "description": "prohibited"
  },
  {
    "code_point": "1F6B3",
    "status": "fully-qualified",
    "icon": "🚳",
    "version": "E1.0",
    "description": "no bicycles"
  },
  {
    "code_point": "1F6AD",
    "status": "fully-qualified",
    "icon": "🚭",
    "version": "E0.6",
    "description": "no smoking"
  },
  {
    "code_point": "1F6AF",
    "status": "fully-qualified",
    "icon": "🚯",
    "version": "E1.0",
    "description": "no littering"
  },
  {
    "code_point": "1F6B1",
    "status": "fully-qualified",
    "icon": "🚱",
    "version": "E1.0",
    "description": "non-potable water"
  },
  {
    "code_point": "1F6B7",
    "status": "fully-qualified",
    "icon": "🚷",
    "version": "E1.0",
    "description": "no pedestrians"
  },
  {
    "code_point": "1F4F5",
    "status": "fully-qualified",
    "icon": "📵",
    "version": "E1.0",
    "description": "no mobile phones"
  },
  {
    "code_point": "1F51E",
    "status": "fully-qualified",
    "icon": "🔞",
    "version": "E0.6",
    "description": "no one under eighteen"
  },
  {
    "code_point": "2622 FE0F",
    "status": "fully-qualified",
    "icon": "☢️",
    "version": "E1.0",
    "description": "radioactive"
  },
  {
    "code_point": "2622",
    "status": "unqualified",
    "icon": "☢",
    "version": "E1.0",
    "description": "radioactive"
  },
  {
    "code_point": "2623 FE0F",
    "status": "fully-qualified",
    "icon": "☣️",
    "version": "E1.0",
    "description": "biohazard"
  },
  {
    "code_point": "2623",
    "status": "unqualified",
    "icon": "☣",
    "version": "E1.0",
    "description": "biohazard"
  },
  {
    "code_point": "2B06 FE0F",
    "status": "fully-qualified",
    "icon": "⬆️",
    "version": "E0.6",
    "description": "up arrow"
  },
  {
    "code_point": "2B06",
    "status": "unqualified",
    "icon": "⬆",
    "version": "E0.6",
    "description": "up arrow"
  },
  {
    "code_point": "2197 FE0F",
    "status": "fully-qualified",
    "icon": "↗️",
    "version": "E0.6",
    "description": "up-right arrow"
  },
  {
    "code_point": "2197",
    "status": "unqualified",
    "icon": "↗",
    "version": "E0.6",
    "description": "up-right arrow"
  },
  {
    "code_point": "27A1 FE0F",
    "status": "fully-qualified",
    "icon": "➡️",
    "version": "E0.6",
    "description": "right arrow"
  },
  {
    "code_point": "27A1",
    "status": "unqualified",
    "icon": "➡",
    "version": "E0.6",
    "description": "right arrow"
  },
  {
    "code_point": "2198 FE0F",
    "status": "fully-qualified",
    "icon": "↘️",
    "version": "E0.6",
    "description": "down-right arrow"
  },
  {
    "code_point": "2198",
    "status": "unqualified",
    "icon": "↘",
    "version": "E0.6",
    "description": "down-right arrow"
  },
  {
    "code_point": "2B07 FE0F",
    "status": "fully-qualified",
    "icon": "⬇️",
    "version": "E0.6",
    "description": "down arrow"
  },
  {
    "code_point": "2B07",
    "status": "unqualified",
    "icon": "⬇",
    "version": "E0.6",
    "description": "down arrow"
  },
  {
    "code_point": "2199 FE0F",
    "status": "fully-qualified",
    "icon": "↙️",
    "version": "E0.6",
    "description": "down-left arrow"
  },
  {
    "code_point": "2199",
    "status": "unqualified",
    "icon": "↙",
    "version": "E0.6",
    "description": "down-left arrow"
  },
  {
    "code_point": "2B05 FE0F",
    "status": "fully-qualified",
    "icon": "⬅️",
    "version": "E0.6",
    "description": "left arrow"
  },
  {
    "code_point": "2B05",
    "status": "unqualified",
    "icon": "⬅",
    "version": "E0.6",
    "description": "left arrow"
  },
  {
    "code_point": "2196 FE0F",
    "status": "fully-qualified",
    "icon": "↖️",
    "version": "E0.6",
    "description": "up-left arrow"
  },
  {
    "code_point": "2196",
    "status": "unqualified",
    "icon": "↖",
    "version": "E0.6",
    "description": "up-left arrow"
  },
  {
    "code_point": "2195 FE0F",
    "status": "fully-qualified",
    "icon": "↕️",
    "version": "E0.6",
    "description": "up-down arrow"
  },
  {
    "code_point": "2195",
    "status": "unqualified",
    "icon": "↕",
    "version": "E0.6",
    "description": "up-down arrow"
  },
  {
    "code_point": "2194 FE0F",
    "status": "fully-qualified",
    "icon": "↔️",
    "version": "E0.6",
    "description": "left-right arrow"
  },
  {
    "code_point": "2194",
    "status": "unqualified",
    "icon": "↔",
    "version": "E0.6",
    "description": "left-right arrow"
  },
  {
    "code_point": "21A9 FE0F",
    "status": "fully-qualified",
    "icon": "↩️",
    "version": "E0.6",
    "description": "right arrow curving left"
  },
  {
    "code_point": "21A9",
    "status": "unqualified",
    "icon": "↩",
    "version": "E0.6",
    "description": "right arrow curving left"
  },
  {
    "code_point": "21AA FE0F",
    "status": "fully-qualified",
    "icon": "↪️",
    "version": "E0.6",
    "description": "left arrow curving right"
  },
  {
    "code_point": "21AA",
    "status": "unqualified",
    "icon": "↪",
    "version": "E0.6",
    "description": "left arrow curving right"
  },
  {
    "code_point": "2934 FE0F",
    "status": "fully-qualified",
    "icon": "⤴️",
    "version": "E0.6",
    "description": "right arrow curving up"
  },
  {
    "code_point": "2934",
    "status": "unqualified",
    "icon": "⤴",
    "version": "E0.6",
    "description": "right arrow curving up"
  },
  {
    "code_point": "2935 FE0F",
    "status": "fully-qualified",
    "icon": "⤵️",
    "version": "E0.6",
    "description": "right arrow curving down"
  },
  {
    "code_point": "2935",
    "status": "unqualified",
    "icon": "⤵",
    "version": "E0.6",
    "description": "right arrow curving down"
  },
  {
    "code_point": "1F503",
    "status": "fully-qualified",
    "icon": "🔃",
    "version": "E0.6",
    "description": "clockwise vertical arrows"
  },
  {
    "code_point": "1F504",
    "status": "fully-qualified",
    "icon": "🔄",
    "version": "E1.0",
    "description": "counterclockwise arrows button"
  },
  {
    "code_point": "1F519",
    "status": "fully-qualified",
    "icon": "🔙",
    "version": "E0.6",
    "description": "BACK arrow"
  },
  {
    "code_point": "1F51A",
    "status": "fully-qualified",
    "icon": "🔚",
    "version": "E0.6",
    "description": "END arrow"
  },
  {
    "code_point": "1F51B",
    "status": "fully-qualified",
    "icon": "🔛",
    "version": "E0.6",
    "description": "ON! arrow"
  },
  {
    "code_point": "1F51C",
    "status": "fully-qualified",
    "icon": "🔜",
    "version": "E0.6",
    "description": "SOON arrow"
  },
  {
    "code_point": "1F51D",
    "status": "fully-qualified",
    "icon": "🔝",
    "version": "E0.6",
    "description": "TOP arrow"
  },
  {
    "code_point": "1F6D0",
    "status": "fully-qualified",
    "icon": "🛐",
    "version": "E1.0",
    "description": "place of worship"
  },
  {
    "code_point": "269B FE0F",
    "status": "fully-qualified",
    "icon": "⚛️",
    "version": "E1.0",
    "description": "atom symbol"
  },
  {
    "code_point": "269B",
    "status": "unqualified",
    "icon": "⚛",
    "version": "E1.0",
    "description": "atom symbol"
  },
  {
    "code_point": "1F549 FE0F",
    "status": "fully-qualified",
    "icon": "🕉️",
    "version": "E0.7",
    "description": "om"
  },
  {
    "code_point": "1F549",
    "status": "unqualified",
    "icon": "🕉",
    "version": "E0.7",
    "description": "om"
  },
  {
    "code_point": "2721 FE0F",
    "status": "fully-qualified",
    "icon": "✡️",
    "version": "E0.7",
    "description": "star of David"
  },
  {
    "code_point": "2721",
    "status": "unqualified",
    "icon": "✡",
    "version": "E0.7",
    "description": "star of David"
  },
  {
    "code_point": "2638 FE0F",
    "status": "fully-qualified",
    "icon": "☸️",
    "version": "E0.7",
    "description": "wheel of dharma"
  },
  {
    "code_point": "2638",
    "status": "unqualified",
    "icon": "☸",
    "version": "E0.7",
    "description": "wheel of dharma"
  },
  {
    "code_point": "262F FE0F",
    "status": "fully-qualified",
    "icon": "☯️",
    "version": "E0.7",
    "description": "yin yang"
  },
  {
    "code_point": "262F",
    "status": "unqualified",
    "icon": "☯",
    "version": "E0.7",
    "description": "yin yang"
  },
  {
    "code_point": "271D FE0F",
    "status": "fully-qualified",
    "icon": "✝️",
    "version": "E0.7",
    "description": "latin cross"
  },
  {
    "code_point": "271D",
    "status": "unqualified",
    "icon": "✝",
    "version": "E0.7",
    "description": "latin cross"
  },
  {
    "code_point": "2626 FE0F",
    "status": "fully-qualified",
    "icon": "☦️",
    "version": "E1.0",
    "description": "orthodox cross"
  },
  {
    "code_point": "2626",
    "status": "unqualified",
    "icon": "☦",
    "version": "E1.0",
    "description": "orthodox cross"
  },
  {
    "code_point": "262A FE0F",
    "status": "fully-qualified",
    "icon": "☪️",
    "version": "E0.7",
    "description": "star and crescent"
  },
  {
    "code_point": "262A",
    "status": "unqualified",
    "icon": "☪",
    "version": "E0.7",
    "description": "star and crescent"
  },
  {
    "code_point": "262E FE0F",
    "status": "fully-qualified",
    "icon": "☮️",
    "version": "E1.0",
    "description": "peace symbol"
  },
  {
    "code_point": "262E",
    "status": "unqualified",
    "icon": "☮",
    "version": "E1.0",
    "description": "peace symbol"
  },
  {
    "code_point": "1F54E",
    "status": "fully-qualified",
    "icon": "🕎",
    "version": "E1.0",
    "description": "menorah"
  },
  {
    "code_point": "1F52F",
    "status": "fully-qualified",
    "icon": "🔯",
    "version": "E0.6",
    "description": "dotted six-pointed star"
  },
  {
    "code_point": "1FAAF",
    "status": "fully-qualified",
    "icon": "🪯",
    "version": "E15.0",
    "description": "khanda"
  },
  {
    "code_point": "2648",
    "status": "fully-qualified",
    "icon": "♈",
    "version": "E0.6",
    "description": "Aries"
  },
  {
    "code_point": "2649",
    "status": "fully-qualified",
    "icon": "♉",
    "version": "E0.6",
    "description": "Taurus"
  },
  {
    "code_point": "264A",
    "status": "fully-qualified",
    "icon": "♊",
    "version": "E0.6",
    "description": "Gemini"
  },
  {
    "code_point": "264B",
    "status": "fully-qualified",
    "icon": "♋",
    "version": "E0.6",
    "description": "Cancer"
  },
  {
    "code_point": "264C",
    "status": "fully-qualified",
    "icon": "♌",
    "version": "E0.6",
    "description": "Leo"
  },
  {
    "code_point": "264D",
    "status": "fully-qualified",
    "icon": "♍",
    "version": "E0.6",
    "description": "Virgo"
  },
  {
    "code_point": "264E",
    "status": "fully-qualified",
    "icon": "♎",
    "version": "E0.6",
    "description": "Libra"
  },
  {
    "code_point": "264F",
    "status": "fully-qualified",
    "icon": "♏",
    "version": "E0.6",
    "description": "Scorpio"
  },
  {
    "code_point": "2650",
    "status": "fully-qualified",
    "icon": "♐",
    "version": "E0.6",
    "description": "Sagittarius"
  },
  {
    "code_point": "2651",
    "status": "fully-qualified",
    "icon": "♑",
    "version": "E0.6",
    "description": "Capricorn"
  },
  {
    "code_point": "2652",
    "status": "fully-qualified",
    "icon": "♒",
    "version": "E0.6",
    "description": "Aquarius"
  },
  {
    "code_point": "2653",
    "status": "fully-qualified",
    "icon": "♓",
    "version": "E0.6",
    "description": "Pisces"
  },
  {
    "code_point": "26CE",
    "status": "fully-qualified",
    "icon": "⛎",
    "version": "E0.6",
    "description": "Ophiuchus"
  },
  {
    "code_point": "1F500",
    "status": "fully-qualified",
    "icon": "🔀",
    "version": "E1.0",
    "description": "shuffle tracks button"
  },
  {
    "code_point": "1F501",
    "status": "fully-qualified",
    "icon": "🔁",
    "version": "E1.0",
    "description": "repeat button"
  },
  {
    "code_point": "1F502",
    "status": "fully-qualified",
    "icon": "🔂",
    "version": "E1.0",
    "description": "repeat single button"
  },
  {
    "code_point": "25B6 FE0F",
    "status": "fully-qualified",
    "icon": "▶️",
    "version": "E0.6",
    "description": "play button"
  },
  {
    "code_point": "25B6",
    "status": "unqualified",
    "icon": "▶",
    "version": "E0.6",
    "description": "play button"
  },
  {
    "code_point": "23E9",
    "status": "fully-qualified",
    "icon": "⏩",
    "version": "E0.6",
    "description": "fast-forward button"
  },
  {
    "code_point": "23ED FE0F",
    "status": "fully-qualified",
    "icon": "⏭️",
    "version": "E0.7",
    "description": "next track button"
  },
  {
    "code_point": "23ED",
    "status": "unqualified",
    "icon": "⏭",
    "version": "E0.7",
    "description": "next track button"
  },
  {
    "code_point": "23EF FE0F",
    "status": "fully-qualified",
    "icon": "⏯️",
    "version": "E1.0",
    "description": "play or pause button"
  },
  {
    "code_point": "23EF",
    "status": "unqualified",
    "icon": "⏯",
    "version": "E1.0",
    "description": "play or pause button"
  },
  {
    "code_point": "25C0 FE0F",
    "status": "fully-qualified",
    "icon": "◀️",
    "version": "E0.6",
    "description": "reverse button"
  },
  {
    "code_point": "25C0",
    "status": "unqualified",
    "icon": "◀",
    "version": "E0.6",
    "description": "reverse button"
  },
  {
    "code_point": "23EA",
    "status": "fully-qualified",
    "icon": "⏪",
    "version": "E0.6",
    "description": "fast reverse button"
  },
  {
    "code_point": "23EE FE0F",
    "status": "fully-qualified",
    "icon": "⏮️",
    "version": "E0.7",
    "description": "last track button"
  },
  {
    "code_point": "23EE",
    "status": "unqualified",
    "icon": "⏮",
    "version": "E0.7",
    "description": "last track button"
  },
  {
    "code_point": "1F53C",
    "status": "fully-qualified",
    "icon": "🔼",
    "version": "E0.6",
    "description": "upwards button"
  },
  {
    "code_point": "23EB",
    "status": "fully-qualified",
    "icon": "⏫",
    "version": "E0.6",
    "description": "fast up button"
  },
  {
    "code_point": "1F53D",
    "status": "fully-qualified",
    "icon": "🔽",
    "version": "E0.6",
    "description": "downwards button"
  },
  {
    "code_point": "23EC",
    "status": "fully-qualified",
    "icon": "⏬",
    "version": "E0.6",
    "description": "fast down button"
  },
  {
    "code_point": "23F8 FE0F",
    "status": "fully-qualified",
    "icon": "⏸️",
    "version": "E0.7",
    "description": "pause button"
  },
  {
    "code_point": "23F8",
    "status": "unqualified",
    "icon": "⏸",
    "version": "E0.7",
    "description": "pause button"
  },
  {
    "code_point": "23F9 FE0F",
    "status": "fully-qualified",
    "icon": "⏹️",
    "version": "E0.7",
    "description": "stop button"
  },
  {
    "code_point": "23F9",
    "status": "unqualified",
    "icon": "⏹",
    "version": "E0.7",
    "description": "stop button"
  },
  {
    "code_point": "23FA FE0F",
    "status": "fully-qualified",
    "icon": "⏺️",
    "version": "E0.7",
    "description": "record button"
  },
  {
    "code_point": "23FA",
    "status": "unqualified",
    "icon": "⏺",
    "version": "E0.7",
    "description": "record button"
  },
  {
    "code_point": "23CF FE0F",
    "status": "fully-qualified",
    "icon": "⏏️",
    "version": "E1.0",
    "description": "eject button"
  },
  {
    "code_point": "23CF",
    "status": "unqualified",
    "icon": "⏏",
    "version": "E1.0",
    "description": "eject button"
  },
  {
    "code_point": "1F3A6",
    "status": "fully-qualified",
    "icon": "🎦",
    "version": "E0.6",
    "description": "cinema"
  },
  {
    "code_point": "1F505",
    "status": "fully-qualified",
    "icon": "🔅",
    "version": "E1.0",
    "description": "dim button"
  },
  {
    "code_point": "1F506",
    "status": "fully-qualified",
    "icon": "🔆",
    "version": "E1.0",
    "description": "bright button"
  },
  {
    "code_point": "1F4F6",
    "status": "fully-qualified",
    "icon": "📶",
    "version": "E0.6",
    "description": "antenna bars"
  },
  {
    "code_point": "1F6DC",
    "status": "fully-qualified",
    "icon": "🛜",
    "version": "E15.0",
    "description": "wireless"
  },
  {
    "code_point": "1F4F3",
    "status": "fully-qualified",
    "icon": "📳",
    "version": "E0.6",
    "description": "vibration mode"
  },
  {
    "code_point": "1F4F4",
    "status": "fully-qualified",
    "icon": "📴",
    "version": "E0.6",
    "description": "mobile phone off"
  },
  {
    "code_point": "2640 FE0F",
    "status": "fully-qualified",
    "icon": "♀️",
    "version": "E4.0",
    "description": "female sign"
  },
  {
    "code_point": "2640",
    "status": "unqualified",
    "icon": "♀",
    "version": "E4.0",
    "description": "female sign"
  },
  {
    "code_point": "2642 FE0F",
    "status": "fully-qualified",
    "icon": "♂️",
    "version": "E4.0",
    "description": "male sign"
  },
  {
    "code_point": "2642",
    "status": "unqualified",
    "icon": "♂",
    "version": "E4.0",
    "description": "male sign"
  },
  {
    "code_point": "26A7 FE0F",
    "status": "fully-qualified",
    "icon": "⚧️",
    "version": "E13.0",
    "description": "transgender symbol"
  },
  {
    "code_point": "26A7",
    "status": "unqualified",
    "icon": "⚧",
    "version": "E13.0",
    "description": "transgender symbol"
  },
  {
    "code_point": "2716 FE0F",
    "status": "fully-qualified",
    "icon": "✖️",
    "version": "E0.6",
    "description": "multiply"
  },
  {
    "code_point": "2716",
    "status": "unqualified",
    "icon": "✖",
    "version": "E0.6",
    "description": "multiply"
  },
  {
    "code_point": "2795",
    "status": "fully-qualified",
    "icon": "➕",
    "version": "E0.6",
    "description": "plus"
  },
  {
    "code_point": "2796",
    "status": "fully-qualified",
    "icon": "➖",
    "version": "E0.6",
    "description": "minus"
  },
  {
    "code_point": "2797",
    "status": "fully-qualified",
    "icon": "➗",
    "version": "E0.6",
    "description": "divide"
  },
  {
    "code_point": "1F7F0",
    "status": "fully-qualified",
    "icon": "🟰",
    "version": "E14.0",
    "description": "heavy equals sign"
  },
  {
    "code_point": "267E FE0F",
    "status": "fully-qualified",
    "icon": "♾️",
    "version": "E11.0",
    "description": "infinity"
  },
  {
    "code_point": "267E",
    "status": "unqualified",
    "icon": "♾",
    "version": "E11.0",
    "description": "infinity"
  },
  {
    "code_point": "203C FE0F",
    "status": "fully-qualified",
    "icon": "‼️",
    "version": "E0.6",
    "description": "double exclamation mark"
  },
  {
    "code_point": "203C",
    "status": "unqualified",
    "icon": "‼",
    "version": "E0.6",
    "description": "double exclamation mark"
  },
  {
    "code_point": "2049 FE0F",
    "status": "fully-qualified",
    "icon": "⁉️",
    "version": "E0.6",
    "description": "exclamation question mark"
  },
  {
    "code_point": "2049",
    "status": "unqualified",
    "icon": "⁉",
    "version": "E0.6",
    "description": "exclamation question mark"
  },
  {
    "code_point": "2753",
    "status": "fully-qualified",
    "icon": "❓",
    "version": "E0.6",
    "description": "red question mark"
  },
  {
    "code_point": "2754",
    "status": "fully-qualified",
    "icon": "❔",
    "version": "E0.6",
    "description": "white question mark"
  },
  {
    "code_point": "2755",
    "status": "fully-qualified",
    "icon": "❕",
    "version": "E0.6",
    "description": "white exclamation mark"
  },
  {
    "code_point": "2757",
    "status": "fully-qualified",
    "icon": "❗",
    "version": "E0.6",
    "description": "red exclamation mark"
  },
  {
    "code_point": "3030 FE0F",
    "status": "fully-qualified",
    "icon": "〰️",
    "version": "E0.6",
    "description": "wavy dash"
  },
  {
    "code_point": "3030",
    "status": "unqualified",
    "icon": "〰",
    "version": "E0.6",
    "description": "wavy dash"
  },
  {
    "code_point": "1F4B1",
    "status": "fully-qualified",
    "icon": "💱",
    "version": "E0.6",
    "description": "currency exchange"
  },
  {
    "code_point": "1F4B2",
    "status": "fully-qualified",
    "icon": "💲",
    "version": "E0.6",
    "description": "heavy dollar sign"
  },
  {
    "code_point": "2695 FE0F",
    "status": "fully-qualified",
    "icon": "⚕️",
    "version": "E4.0",
    "description": "medical symbol"
  },
  {
    "code_point": "2695",
    "status": "unqualified",
    "icon": "⚕",
    "version": "E4.0",
    "description": "medical symbol"
  },
  {
    "code_point": "267B FE0F",
    "status": "fully-qualified",
    "icon": "♻️",
    "version": "E0.6",
    "description": "recycling symbol"
  },
  {
    "code_point": "267B",
    "status": "unqualified",
    "icon": "♻",
    "version": "E0.6",
    "description": "recycling symbol"
  },
  {
    "code_point": "269C FE0F",
    "status": "fully-qualified",
    "icon": "⚜️",
    "version": "E1.0",
    "description": "fleur-de-lis"
  },
  {
    "code_point": "269C",
    "status": "unqualified",
    "icon": "⚜",
    "version": "E1.0",
    "description": "fleur-de-lis"
  },
  {
    "code_point": "1F531",
    "status": "fully-qualified",
    "icon": "🔱",
    "version": "E0.6",
    "description": "trident emblem"
  },
  {
    "code_point": "1F4DB",
    "status": "fully-qualified",
    "icon": "📛",
    "version": "E0.6",
    "description": "name badge"
  },
  {
    "code_point": "1F530",
    "status": "fully-qualified",
    "icon": "🔰",
    "version": "E0.6",
    "description": "Japanese symbol for beginner"
  },
  {
    "code_point": "2B55",
    "status": "fully-qualified",
    "icon": "⭕",
    "version": "E0.6",
    "description": "hollow red circle"
  },
  {
    "code_point": "2705",
    "status": "fully-qualified",
    "icon": "✅",
    "version": "E0.6",
    "description": "check mark button"
  },
  {
    "code_point": "2611 FE0F",
    "status": "fully-qualified",
    "icon": "☑️",
    "version": "E0.6",
    "description": "check box with check"
  },
  {
    "code_point": "2611",
    "status": "unqualified",
    "icon": "☑",
    "version": "E0.6",
    "description": "check box with check"
  },
  {
    "code_point": "2714 FE0F",
    "status": "fully-qualified",
    "icon": "✔️",
    "version": "E0.6",
    "description": "check mark"
  },
  {
    "code_point": "2714",
    "status": "unqualified",
    "icon": "✔",
    "version": "E0.6",
    "description": "check mark"
  },
  {
    "code_point": "274C",
    "status": "fully-qualified",
    "icon": "❌",
    "version": "E0.6",
    "description": "cross mark"
  },
  {
    "code_point": "274E",
    "status": "fully-qualified",
    "icon": "❎",
    "version": "E0.6",
    "description": "cross mark button"
  },
  {
    "code_point": "27B0",
    "status": "fully-qualified",
    "icon": "➰",
    "version": "E0.6",
    "description": "curly loop"
  },
  {
    "code_point": "27BF",
    "status": "fully-qualified",
    "icon": "➿",
    "version": "E1.0",
    "description": "double curly loop"
  },
  {
    "code_point": "303D FE0F",
    "status": "fully-qualified",
    "icon": "〽️",
    "version": "E0.6",
    "description": "part alternation mark"
  },
  {
    "code_point": "303D",
    "status": "unqualified",
    "icon": "〽",
    "version": "E0.6",
    "description": "part alternation mark"
  },
  {
    "code_point": "2733 FE0F",
    "status": "fully-qualified",
    "icon": "✳️",
    "version": "E0.6",
    "description": "eight-spoked asterisk"
  },
  {
    "code_point": "2733",
    "status": "unqualified",
    "icon": "✳",
    "version": "E0.6",
    "description": "eight-spoked asterisk"
  },
  {
    "code_point": "2734 FE0F",
    "status": "fully-qualified",
    "icon": "✴️",
    "version": "E0.6",
    "description": "eight-pointed star"
  },
  {
    "code_point": "2734",
    "status": "unqualified",
    "icon": "✴",
    "version": "E0.6",
    "description": "eight-pointed star"
  },
  {
    "code_point": "2747 FE0F",
    "status": "fully-qualified",
    "icon": "❇️",
    "version": "E0.6",
    "description": "sparkle"
  },
  {
    "code_point": "2747",
    "status": "unqualified",
    "icon": "❇",
    "version": "E0.6",
    "description": "sparkle"
  },
  {
    "code_point": "00A9 FE0F",
    "status": "fully-qualified",
    "icon": "©️",
    "version": "E0.6",
    "description": "copyright"
  },
  {
    "code_point": "00A9",
    "status": "unqualified",
    "icon": "©",
    "version": "E0.6",
    "description": "copyright"
  },
  {
    "code_point": "00AE FE0F",
    "status": "fully-qualified",
    "icon": "®️",
    "version": "E0.6",
    "description": "registered"
  },
  {
    "code_point": "00AE",
    "status": "unqualified",
    "icon": "®",
    "version": "E0.6",
    "description": "registered"
  },
  {
    "code_point": "2122 FE0F",
    "status": "fully-qualified",
    "icon": "™️",
    "version": "E0.6",
    "description": "trade mark"
  },
  {
    "code_point": "2122",
    "status": "unqualified",
    "icon": "™",
    "version": "E0.6",
    "description": "trade mark"
  },
  {
    "code_point": "1FADF",
    "status": "fully-qualified",
    "icon": "🫟",
    "version": "E16.0",
    "description": "splatter"
  },
  {
    "code_point": "0023 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "",
    "version": "",
    "description": ""
  },
  {
    "code_point": "0023 20E3",
    "status": "unqualified",
    "icon": "",
    "version": "",
    "description": ""
  },
  {
    "code_point": "002A FE0F 20E3",
    "status": "fully-qualified",
    "icon": "*️⃣",
    "version": "E2.0",
    "description": "keycap: *"
  },
  {
    "code_point": "002A 20E3",
    "status": "unqualified",
    "icon": "*⃣",
    "version": "E2.0",
    "description": "keycap: *"
  },
  {
    "code_point": "0030 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "0️⃣",
    "version": "E0.6",
    "description": "keycap: 0"
  },
  {
    "code_point": "0030 20E3",
    "status": "unqualified",
    "icon": "0⃣",
    "version": "E0.6",
    "description": "keycap: 0"
  },
  {
    "code_point": "0031 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "1️⃣",
    "version": "E0.6",
    "description": "keycap: 1"
  },
  {
    "code_point": "0031 20E3",
    "status": "unqualified",
    "icon": "1⃣",
    "version": "E0.6",
    "description": "keycap: 1"
  },
  {
    "code_point": "0032 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "2️⃣",
    "version": "E0.6",
    "description": "keycap: 2"
  },
  {
    "code_point": "0032 20E3",
    "status": "unqualified",
    "icon": "2⃣",
    "version": "E0.6",
    "description": "keycap: 2"
  },
  {
    "code_point": "0033 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "3️⃣",
    "version": "E0.6",
    "description": "keycap: 3"
  },
  {
    "code_point": "0033 20E3",
    "status": "unqualified",
    "icon": "3⃣",
    "version": "E0.6",
    "description": "keycap: 3"
  },
  {
    "code_point": "0034 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "4️⃣",
    "version": "E0.6",
    "description": "keycap: 4"
  },
  {
    "code_point": "0034 20E3",
    "status": "unqualified",
    "icon": "4⃣",
    "version": "E0.6",
    "description": "keycap: 4"
  },
  {
    "code_point": "0035 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "5️⃣",
    "version": "E0.6",
    "description": "keycap: 5"
  },
  {
    "code_point": "0035 20E3",
    "status": "unqualified",
    "icon": "5⃣",
    "version": "E0.6",
    "description": "keycap: 5"
  },
  {
    "code_point": "0036 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "6️⃣",
    "version": "E0.6",
    "description": "keycap: 6"
  },
  {
    "code_point": "0036 20E3",
    "status": "unqualified",
    "icon": "6⃣",
    "version": "E0.6",
    "description": "keycap: 6"
  },
  {
    "code_point": "0037 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "7️⃣",
    "version": "E0.6",
    "description": "keycap: 7"
  },
  {
    "code_point": "0037 20E3",
    "status": "unqualified",
    "icon": "7⃣",
    "version": "E0.6",
    "description": "keycap: 7"
  },
  {
    "code_point": "0038 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "8️⃣",
    "version": "E0.6",
    "description": "keycap: 8"
  },
  {
    "code_point": "0038 20E3",
    "status": "unqualified",
    "icon": "8⃣",
    "version": "E0.6",
    "description": "keycap: 8"
  },
  {
    "code_point": "0039 FE0F 20E3",
    "status": "fully-qualified",
    "icon": "9️⃣",
    "version": "E0.6",
    "description": "keycap: 9"
  },
  {
    "code_point": "0039 20E3",
    "status": "unqualified",
    "icon": "9⃣",
    "version": "E0.6",
    "description": "keycap: 9"
  },
  {
    "code_point": "1F51F",
    "status": "fully-qualified",
    "icon": "🔟",
    "version": "E0.6",
    "description": "keycap: 10"
  },
  {
    "code_point": "1F520",
    "status": "fully-qualified",
    "icon": "🔠",
    "version": "E0.6",
    "description": "input latin uppercase"
  },
  {
    "code_point": "1F521",
    "status": "fully-qualified",
    "icon": "🔡",
    "version": "E0.6",
    "description": "input latin lowercase"
  },
  {
    "code_point": "1F522",
    "status": "fully-qualified",
    "icon": "🔢",
    "version": "E0.6",
    "description": "input numbers"
  },
  {
    "code_point": "1F523",
    "status": "fully-qualified",
    "icon": "🔣",
    "version": "E0.6",
    "description": "input symbols"
  },
  {
    "code_point": "1F524",
    "status": "fully-qualified",
    "icon": "🔤",
    "version": "E0.6",
    "description": "input latin letters"
  },
  {
    "code_point": "1F170 FE0F",
    "status": "fully-qualified",
    "icon": "🅰️",
    "version": "E0.6",
    "description": "A button (blood type)"
  },
  {
    "code_point": "1F170",
    "status": "unqualified",
    "icon": "🅰",
    "version": "E0.6",
    "description": "A button (blood type)"
  },
  {
    "code_point": "1F18E",
    "status": "fully-qualified",
    "icon": "🆎",
    "version": "E0.6",
    "description": "AB button (blood type)"
  },
  {
    "code_point": "1F171 FE0F",
    "status": "fully-qualified",
    "icon": "🅱️",
    "version": "E0.6",
    "description": "B button (blood type)"
  },
  {
    "code_point": "1F171",
    "status": "unqualified",
    "icon": "🅱",
    "version": "E0.6",
    "description": "B button (blood type)"
  },
  {
    "code_point": "1F191",
    "status": "fully-qualified",
    "icon": "🆑",
    "version": "E0.6",
    "description": "CL button"
  },
  {
    "code_point": "1F192",
    "status": "fully-qualified",
    "icon": "🆒",
    "version": "E0.6",
    "description": "COOL button"
  },
  {
    "code_point": "1F193",
    "status": "fully-qualified",
    "icon": "🆓",
    "version": "E0.6",
    "description": "FREE button"
  },
  {
    "code_point": "2139 FE0F",
    "status": "fully-qualified",
    "icon": "ℹ️",
    "version": "E0.6",
    "description": "information"
  },
  {
    "code_point": "2139",
    "status": "unqualified",
    "icon": "ℹ",
    "version": "E0.6",
    "description": "information"
  },
  {
    "code_point": "1F194",
    "status": "fully-qualified",
    "icon": "🆔",
    "version": "E0.6",
    "description": "ID button"
  },
  {
    "code_point": "24C2 FE0F",
    "status": "fully-qualified",
    "icon": "Ⓜ️",
    "version": "E0.6",
    "description": "circled M"
  },
  {
    "code_point": "24C2",
    "status": "unqualified",
    "icon": "Ⓜ",
    "version": "E0.6",
    "description": "circled M"
  },
  {
    "code_point": "1F195",
    "status": "fully-qualified",
    "icon": "🆕",
    "version": "E0.6",
    "description": "NEW button"
  },
  {
    "code_point": "1F196",
    "status": "fully-qualified",
    "icon": "🆖",
    "version": "E0.6",
    "description": "NG button"
  },
  {
    "code_point": "1F17E FE0F",
    "status": "fully-qualified",
    "icon": "🅾️",
    "version": "E0.6",
    "description": "O button (blood type)"
  },
  {
    "code_point": "1F17E",
    "status": "unqualified",
    "icon": "🅾",
    "version": "E0.6",
    "description": "O button (blood type)"
  },
  {
    "code_point": "1F197",
    "status": "fully-qualified",
    "icon": "🆗",
    "version": "E0.6",
    "description": "OK button"
  },
  {
    "code_point": "1F17F FE0F",
    "status": "fully-qualified",
    "icon": "🅿️",
    "version": "E0.6",
    "description": "P button"
  },
  {
    "code_point": "1F17F",
    "status": "unqualified",
    "icon": "🅿",
    "version": "E0.6",
    "description": "P button"
  },
  {
    "code_point": "1F198",
    "status": "fully-qualified",
    "icon": "🆘",
    "version": "E0.6",
    "description": "SOS button"
  },
  {
    "code_point": "1F199",
    "status": "fully-qualified",
    "icon": "🆙",
    "version": "E0.6",
    "description": "UP! button"
  },
  {
    "code_point": "1F19A",
    "status": "fully-qualified",
    "icon": "🆚",
    "version": "E0.6",
    "description": "VS button"
  },
  {
    "code_point": "1F201",
    "status": "fully-qualified",
    "icon": "🈁",
    "version": "E0.6",
    "description": "Japanese “here” button"
  },
  {
    "code_point": "1F202 FE0F",
    "status": "fully-qualified",
    "icon": "🈂️",
    "version": "E0.6",
    "description": "Japanese “service charge” button"
  },
  {
    "code_point": "1F202",
    "status": "unqualified",
    "icon": "🈂",
    "version": "E0.6",
    "description": "Japanese “service charge” button"
  },
  {
    "code_point": "1F237 FE0F",
    "status": "fully-qualified",
    "icon": "🈷️",
    "version": "E0.6",
    "description": "Japanese “monthly amount” button"
  },
  {
    "code_point": "1F237",
    "status": "unqualified",
    "icon": "🈷",
    "version": "E0.6",
    "description": "Japanese “monthly amount” button"
  },
  {
    "code_point": "1F236",
    "status": "fully-qualified",
    "icon": "🈶",
    "version": "E0.6",
    "description": "Japanese “not free of charge” button"
  },
  {
    "code_point": "1F22F",
    "status": "fully-qualified",
    "icon": "🈯",
    "version": "E0.6",
    "description": "Japanese “reserved” button"
  },
  {
    "code_point": "1F250",
    "status": "fully-qualified",
    "icon": "🉐",
    "version": "E0.6",
    "description": "Japanese “bargain” button"
  },
  {
    "code_point": "1F239",
    "status": "fully-qualified",
    "icon": "🈹",
    "version": "E0.6",
    "description": "Japanese “discount” button"
  },
  {
    "code_point": "1F21A",
    "status": "fully-qualified",
    "icon": "🈚",
    "version": "E0.6",
    "description": "Japanese “free of charge” button"
  },
  {
    "code_point": "1F232",
    "status": "fully-qualified",
    "icon": "🈲",
    "version": "E0.6",
    "description": "Japanese “prohibited” button"
  },
  {
    "code_point": "1F251",
    "status": "fully-qualified",
    "icon": "🉑",
    "version": "E0.6",
    "description": "Japanese “acceptable” button"
  },
  {
    "code_point": "1F238",
    "status": "fully-qualified",
    "icon": "🈸",
    "version": "E0.6",
    "description": "Japanese “application” button"
  },
  {
    "code_point": "1F234",
    "status": "fully-qualified",
    "icon": "🈴",
    "version": "E0.6",
    "description": "Japanese “passing grade” button"
  },
  {
    "code_point": "1F233",
    "status": "fully-qualified",
    "icon": "🈳",
    "version": "E0.6",
    "description": "Japanese “vacancy” button"
  },
  {
    "code_point": "3297 FE0F",
    "status": "fully-qualified",
    "icon": "㊗️",
    "version": "E0.6",
    "description": "Japanese “congratulations” button"
  },
  {
    "code_point": "3297",
    "status": "unqualified",
    "icon": "㊗",
    "version": "E0.6",
    "description": "Japanese “congratulations” button"
  },
  {
    "code_point": "3299 FE0F",
    "status": "fully-qualified",
    "icon": "㊙️",
    "version": "E0.6",
    "description": "Japanese “secret” button"
  },
  {
    "code_point": "3299",
    "status": "unqualified",
    "icon": "㊙",
    "version": "E0.6",
    "description": "Japanese “secret” button"
  },
  {
    "code_point": "1F23A",
    "status": "fully-qualified",
    "icon": "🈺",
    "version": "E0.6",
    "description": "Japanese “open for business” button"
  },
  {
    "code_point": "1F235",
    "status": "fully-qualified",
    "icon": "🈵",
    "version": "E0.6",
    "description": "Japanese “no vacancy” button"
  },
  {
    "code_point": "1F534",
    "status": "fully-qualified",
    "icon": "🔴",
    "version": "E0.6",
    "description": "red circle"
  },
  {
    "code_point": "1F7E0",
    "status": "fully-qualified",
    "icon": "🟠",
    "version": "E12.0",
    "description": "orange circle"
  },
  {
    "code_point": "1F7E1",
    "status": "fully-qualified",
    "icon": "🟡",
    "version": "E12.0",
    "description": "yellow circle"
  },
  {
    "code_point": "1F7E2",
    "status": "fully-qualified",
    "icon": "🟢",
    "version": "E12.0",
    "description": "green circle"
  },
  {
    "code_point": "1F535",
    "status": "fully-qualified",
    "icon": "🔵",
    "version": "E0.6",
    "description": "blue circle"
  },
  {
    "code_point": "1F7E3",
    "status": "fully-qualified",
    "icon": "🟣",
    "version": "E12.0",
    "description": "purple circle"
  },
  {
    "code_point": "1F7E4",
    "status": "fully-qualified",
    "icon": "🟤",
    "version": "E12.0",
    "description": "brown circle"
  },
  {
    "code_point": "26AB",
    "status": "fully-qualified",
    "icon": "⚫",
    "version": "E0.6",
    "description": "black circle"
  },
  {
    "code_point": "26AA",
    "status": "fully-qualified",
    "icon": "⚪",
    "version": "E0.6",
    "description": "white circle"
  },
  {
    "code_point": "1F7E5",
    "status": "fully-qualified",
    "icon": "🟥",
    "version": "E12.0",
    "description": "red square"
  },
  {
    "code_point": "1F7E7",
    "status": "fully-qualified",
    "icon": "🟧",
    "version": "E12.0",
    "description": "orange square"
  },
  {
    "code_point": "1F7E8",
    "status": "fully-qualified",
    "icon": "🟨",
    "version": "E12.0",
    "description": "yellow square"
  },
  {
    "code_point": "1F7E9",
    "status": "fully-qualified",
    "icon": "🟩",
    "version": "E12.0",
    "description": "green square"
  },
  {
    "code_point": "1F7E6",
    "status": "fully-qualified",
    "icon": "🟦",
    "version": "E12.0",
    "description": "blue square"
  },
  {
    "code_point": "1F7EA",
    "status": "fully-qualified",
    "icon": "🟪",
    "version": "E12.0",
    "description": "purple square"
  },
  {
    "code_point": "1F7EB",
    "status": "fully-qualified",
    "icon": "🟫",
    "version": "E12.0",
    "description": "brown square"
  },
  {
    "code_point": "2B1B",
    "status": "fully-qualified",
    "icon": "⬛",
    "version": "E0.6",
    "description": "black large square"
  },
  {
    "code_point": "2B1C",
    "status": "fully-qualified",
    "icon": "⬜",
    "version": "E0.6",
    "description": "white large square"
  },
  {
    "code_point": "25FC FE0F",
    "status": "fully-qualified",
    "icon": "◼️",
    "version": "E0.6",
    "description": "black medium square"
  },
  {
    "code_point": "25FC",
    "status": "unqualified",
    "icon": "◼",
    "version": "E0.6",
    "description": "black medium square"
  },
  {
    "code_point": "25FB FE0F",
    "status": "fully-qualified",
    "icon": "◻️",
    "version": "E0.6",
    "description": "white medium square"
  },
  {
    "code_point": "25FB",
    "status": "unqualified",
    "icon": "◻",
    "version": "E0.6",
    "description": "white medium square"
  },
  {
    "code_point": "25FE",
    "status": "fully-qualified",
    "icon": "◾",
    "version": "E0.6",
    "description": "black medium-small square"
  },
  {
    "code_point": "25FD",
    "status": "fully-qualified",
    "icon": "◽",
    "version": "E0.6",
    "description": "white medium-small square"
  },
  {
    "code_point": "25AA FE0F",
    "status": "fully-qualified",
    "icon": "▪️",
    "version": "E0.6",
    "description": "black small square"
  },
  {
    "code_point": "25AA",
    "status": "unqualified",
    "icon": "▪",
    "version": "E0.6",
    "description": "black small square"
  },
  {
    "code_point": "25AB FE0F",
    "status": "fully-qualified",
    "icon": "▫️",
    "version": "E0.6",
    "description": "white small square"
  },
  {
    "code_point": "25AB",
    "status": "unqualified",
    "icon": "▫",
    "version": "E0.6",
    "description": "white small square"
  },
  {
    "code_point": "1F536",
    "status": "fully-qualified",
    "icon": "🔶",
    "version": "E0.6",
    "description": "large orange diamond"
  },
  {
    "code_point": "1F537",
    "status": "fully-qualified",
    "icon": "🔷",
    "version": "E0.6",
    "description": "large blue diamond"
  },
  {
    "code_point": "1F538",
    "status": "fully-qualified",
    "icon": "🔸",
    "version": "E0.6",
    "description": "small orange diamond"
  },
  {
    "code_point": "1F539",
    "status": "fully-qualified",
    "icon": "🔹",
    "version": "E0.6",
    "description": "small blue diamond"
  },
  {
    "code_point": "1F53A",
    "status": "fully-qualified",
    "icon": "🔺",
    "version": "E0.6",
    "description": "red triangle pointed up"
  },
  {
    "code_point": "1F53B",
    "status": "fully-qualified",
    "icon": "🔻",
    "version": "E0.6",
    "description": "red triangle pointed down"
  },
  {
    "code_point": "1F4A0",
    "status": "fully-qualified",
    "icon": "💠",
    "version": "E0.6",
    "description": "diamond with a dot"
  },
  {
    "code_point": "1F518",
    "status": "fully-qualified",
    "icon": "🔘",
    "version": "E0.6",
    "description": "radio button"
  },
  {
    "code_point": "1F533",
    "status": "fully-qualified",
    "icon": "🔳",
    "version": "E0.6",
    "description": "white square button"
  },
  {
    "code_point": "1F532",
    "status": "fully-qualified",
    "icon": "🔲",
    "version": "E0.6",
    "description": "black square button"
  },
  {
    "code_point": "1F3C1",
    "status": "fully-qualified",
    "icon": "🏁",
    "version": "E0.6",
    "description": "chequered flag"
  },
  {
    "code_point": "1F6A9",
    "status": "fully-qualified",
    "icon": "🚩",
    "version": "E0.6",
    "description": "triangular flag"
  },
  {
    "code_point": "1F38C",
    "status": "fully-qualified",
    "icon": "🎌",
    "version": "E0.6",
    "description": "crossed flags"
  },
  {
    "code_point": "1F3F4",
    "status": "fully-qualified",
    "icon": "🏴",
    "version": "E1.0",
    "description": "black flag"
  },
  {
    "code_point": "1F3F3 FE0F",
    "status": "fully-qualified",
    "icon": "🏳️",
    "version": "E0.7",
    "description": "white flag"
  },
  {
    "code_point": "1F3F3",
    "status": "unqualified",
    "icon": "🏳",
    "version": "E0.7",
    "description": "white flag"
  },
  {
    "code_point": "1F3F3 FE0F 200D 1F308",
    "status": "fully-qualified",
    "icon": "🏳️‍🌈",
    "version": "E4.0",
    "description": "rainbow flag"
  },
  {
    "code_point": "1F3F3 200D 1F308",
    "status": "unqualified",
    "icon": "🏳‍🌈",
    "version": "E4.0",
    "description": "rainbow flag"
  },
  {
    "code_point": "1F3F3 FE0F 200D 26A7 FE0F",
    "status": "fully-qualified",
    "icon": "🏳️‍⚧️",
    "version": "E13.0",
    "description": "transgender flag"
  },
  {
    "code_point": "1F3F3 200D 26A7 FE0F",
    "status": "unqualified",
    "icon": "🏳‍⚧️",
    "version": "E13.0",
    "description": "transgender flag"
  },
  {
    "code_point": "1F3F3 FE0F 200D 26A7",
    "status": "minimally-qualified",
    "icon": "🏳️‍⚧",
    "version": "E13.0",
    "description": "transgender flag"
  },
  {
    "code_point": "1F3F3 200D 26A7",
    "status": "unqualified",
    "icon": "🏳‍⚧",
    "version": "E13.0",
    "description": "transgender flag"
  },
  {
    "code_point": "1F3F4 200D 2620 FE0F",
    "status": "fully-qualified",
    "icon": "🏴‍☠️",
    "version": "E11.0",
    "description": "pirate flag"
  },
  {
    "code_point": "1F3F4 200D 2620",
    "status": "minimally-qualified",
    "icon": "🏴‍☠",
    "version": "E11.0",
    "description": "pirate flag"
  },
  {
    "code_point": "1F1E6 1F1E8",
    "status": "fully-qualified",
    "icon": "🇦🇨",
    "version": "E2.0",
    "description": "flag: Ascension Island"
  },
  {
    "code_point": "1F1E6 1F1E9",
    "status": "fully-qualified",
    "icon": "🇦🇩",
    "version": "E2.0",
    "description": "flag: Andorra"
  },
  {
    "code_point": "1F1E6 1F1EA",
    "status": "fully-qualified",
    "icon": "🇦🇪",
    "version": "E2.0",
    "description": "flag: United Arab Emirates"
  },
  {
    "code_point": "1F1E6 1F1EB",
    "status": "fully-qualified",
    "icon": "🇦🇫",
    "version": "E2.0",
    "description": "flag: Afghanistan"
  },
  {
    "code_point": "1F1E6 1F1EC",
    "status": "fully-qualified",
    "icon": "🇦🇬",
    "version": "E2.0",
    "description": "flag: Antigua & Barbuda"
  },
  {
    "code_point": "1F1E6 1F1EE",
    "status": "fully-qualified",
    "icon": "🇦🇮",
    "version": "E2.0",
    "description": "flag: Anguilla"
  },
  {
    "code_point": "1F1E6 1F1F1",
    "status": "fully-qualified",
    "icon": "🇦🇱",
    "version": "E2.0",
    "description": "flag: Albania"
  },
  {
    "code_point": "1F1E6 1F1F2",
    "status": "fully-qualified",
    "icon": "🇦🇲",
    "version": "E2.0",
    "description": "flag: Armenia"
  },
  {
    "code_point": "1F1E6 1F1F4",
    "status": "fully-qualified",
    "icon": "🇦🇴",
    "version": "E2.0",
    "description": "flag: Angola"
  },
  {
    "code_point": "1F1E6 1F1F6",
    "status": "fully-qualified",
    "icon": "🇦🇶",
    "version": "E2.0",
    "description": "flag: Antarctica"
  },
  {
    "code_point": "1F1E6 1F1F7",
    "status": "fully-qualified",
    "icon": "🇦🇷",
    "version": "E2.0",
    "description": "flag: Argentina"
  },
  {
    "code_point": "1F1E6 1F1F8",
    "status": "fully-qualified",
    "icon": "🇦🇸",
    "version": "E2.0",
    "description": "flag: American Samoa"
  },
  {
    "code_point": "1F1E6 1F1F9",
    "status": "fully-qualified",
    "icon": "🇦🇹",
    "version": "E2.0",
    "description": "flag: Austria"
  },
  {
    "code_point": "1F1E6 1F1FA",
    "status": "fully-qualified",
    "icon": "🇦🇺",
    "version": "E2.0",
    "description": "flag: Australia"
  },
  {
    "code_point": "1F1E6 1F1FC",
    "status": "fully-qualified",
    "icon": "🇦🇼",
    "version": "E2.0",
    "description": "flag: Aruba"
  },
  {
    "code_point": "1F1E6 1F1FD",
    "status": "fully-qualified",
    "icon": "🇦🇽",
    "version": "E2.0",
    "description": "flag: Åland Islands"
  },
  {
    "code_point": "1F1E6 1F1FF",
    "status": "fully-qualified",
    "icon": "🇦🇿",
    "version": "E2.0",
    "description": "flag: Azerbaijan"
  },
  {
    "code_point": "1F1E7 1F1E6",
    "status": "fully-qualified",
    "icon": "🇧🇦",
    "version": "E2.0",
    "description": "flag: Bosnia & Herzegovina"
  },
  {
    "code_point": "1F1E7 1F1E7",
    "status": "fully-qualified",
    "icon": "🇧🇧",
    "version": "E2.0",
    "description": "flag: Barbados"
  },
  {
    "code_point": "1F1E7 1F1E9",
    "status": "fully-qualified",
    "icon": "🇧🇩",
    "version": "E2.0",
    "description": "flag: Bangladesh"
  },
  {
    "code_point": "1F1E7 1F1EA",
    "status": "fully-qualified",
    "icon": "🇧🇪",
    "version": "E2.0",
    "description": "flag: Belgium"
  },
  {
    "code_point": "1F1E7 1F1EB",
    "status": "fully-qualified",
    "icon": "🇧🇫",
    "version": "E2.0",
    "description": "flag: Burkina Faso"
  },
  {
    "code_point": "1F1E7 1F1EC",
    "status": "fully-qualified",
    "icon": "🇧🇬",
    "version": "E2.0",
    "description": "flag: Bulgaria"
  },
  {
    "code_point": "1F1E7 1F1ED",
    "status": "fully-qualified",
    "icon": "🇧🇭",
    "version": "E2.0",
    "description": "flag: Bahrain"
  },
  {
    "code_point": "1F1E7 1F1EE",
    "status": "fully-qualified",
    "icon": "🇧🇮",
    "version": "E2.0",
    "description": "flag: Burundi"
  },
  {
    "code_point": "1F1E7 1F1EF",
    "status": "fully-qualified",
    "icon": "🇧🇯",
    "version": "E2.0",
    "description": "flag: Benin"
  },
  {
    "code_point": "1F1E7 1F1F1",
    "status": "fully-qualified",
    "icon": "🇧🇱",
    "version": "E2.0",
    "description": "flag: St. Barthélemy"
  },
  {
    "code_point": "1F1E7 1F1F2",
    "status": "fully-qualified",
    "icon": "🇧🇲",
    "version": "E2.0",
    "description": "flag: Bermuda"
  },
  {
    "code_point": "1F1E7 1F1F3",
    "status": "fully-qualified",
    "icon": "🇧🇳",
    "version": "E2.0",
    "description": "flag: Brunei"
  },
  {
    "code_point": "1F1E7 1F1F4",
    "status": "fully-qualified",
    "icon": "🇧🇴",
    "version": "E2.0",
    "description": "flag: Bolivia"
  },
  {
    "code_point": "1F1E7 1F1F6",
    "status": "fully-qualified",
    "icon": "🇧🇶",
    "version": "E2.0",
    "description": "flag: Caribbean Netherlands"
  },
  {
    "code_point": "1F1E7 1F1F7",
    "status": "fully-qualified",
    "icon": "🇧🇷",
    "version": "E2.0",
    "description": "flag: Brazil"
  },
  {
    "code_point": "1F1E7 1F1F8",
    "status": "fully-qualified",
    "icon": "🇧🇸",
    "version": "E2.0",
    "description": "flag: Bahamas"
  },
  {
    "code_point": "1F1E7 1F1F9",
    "status": "fully-qualified",
    "icon": "🇧🇹",
    "version": "E2.0",
    "description": "flag: Bhutan"
  },
  {
    "code_point": "1F1E7 1F1FB",
    "status": "fully-qualified",
    "icon": "🇧🇻",
    "version": "E2.0",
    "description": "flag: Bouvet Island"
  },
  {
    "code_point": "1F1E7 1F1FC",
    "status": "fully-qualified",
    "icon": "🇧🇼",
    "version": "E2.0",
    "description": "flag: Botswana"
  },
  {
    "code_point": "1F1E7 1F1FE",
    "status": "fully-qualified",
    "icon": "🇧🇾",
    "version": "E2.0",
    "description": "flag: Belarus"
  },
  {
    "code_point": "1F1E7 1F1FF",
    "status": "fully-qualified",
    "icon": "🇧🇿",
    "version": "E2.0",
    "description": "flag: Belize"
  },
  {
    "code_point": "1F1E8 1F1E6",
    "status": "fully-qualified",
    "icon": "🇨🇦",
    "version": "E2.0",
    "description": "flag: Canada"
  },
  {
    "code_point": "1F1E8 1F1E8",
    "status": "fully-qualified",
    "icon": "🇨🇨",
    "version": "E2.0",
    "description": "flag: Cocos (Keeling) Islands"
  },
  {
    "code_point": "1F1E8 1F1E9",
    "status": "fully-qualified",
    "icon": "🇨🇩",
    "version": "E2.0",
    "description": "flag: Congo - Kinshasa"
  },
  {
    "code_point": "1F1E8 1F1EB",
    "status": "fully-qualified",
    "icon": "🇨🇫",
    "version": "E2.0",
    "description": "flag: Central African Republic"
  },
  {
    "code_point": "1F1E8 1F1EC",
    "status": "fully-qualified",
    "icon": "🇨🇬",
    "version": "E2.0",
    "description": "flag: Congo - Brazzaville"
  },
  {
    "code_point": "1F1E8 1F1ED",
    "status": "fully-qualified",
    "icon": "🇨🇭",
    "version": "E2.0",
    "description": "flag: Switzerland"
  },
  {
    "code_point": "1F1E8 1F1EE",
    "status": "fully-qualified",
    "icon": "🇨🇮",
    "version": "E2.0",
    "description": "flag: Côte d’Ivoire"
  },
  {
    "code_point": "1F1E8 1F1F0",
    "status": "fully-qualified",
    "icon": "🇨🇰",
    "version": "E2.0",
    "description": "flag: Cook Islands"
  },
  {
    "code_point": "1F1E8 1F1F1",
    "status": "fully-qualified",
    "icon": "🇨🇱",
    "version": "E2.0",
    "description": "flag: Chile"
  },
  {
    "code_point": "1F1E8 1F1F2",
    "status": "fully-qualified",
    "icon": "🇨🇲",
    "version": "E2.0",
    "description": "flag: Cameroon"
  },
  {
    "code_point": "1F1E8 1F1F3",
    "status": "fully-qualified",
    "icon": "🇨🇳",
    "version": "E0.6",
    "description": "flag: China"
  },
  {
    "code_point": "1F1E8 1F1F4",
    "status": "fully-qualified",
    "icon": "🇨🇴",
    "version": "E2.0",
    "description": "flag: Colombia"
  },
  {
    "code_point": "1F1E8 1F1F5",
    "status": "fully-qualified",
    "icon": "🇨🇵",
    "version": "E2.0",
    "description": "flag: Clipperton Island"
  },
  {
    "code_point": "1F1E8 1F1F6",
    "status": "fully-qualified",
    "icon": "🇨🇶",
    "version": "E16.0",
    "description": "flag: Sark"
  },
  {
    "code_point": "1F1E8 1F1F7",
    "status": "fully-qualified",
    "icon": "🇨🇷",
    "version": "E2.0",
    "description": "flag: Costa Rica"
  },
  {
    "code_point": "1F1E8 1F1FA",
    "status": "fully-qualified",
    "icon": "🇨🇺",
    "version": "E2.0",
    "description": "flag: Cuba"
  },
  {
    "code_point": "1F1E8 1F1FB",
    "status": "fully-qualified",
    "icon": "🇨🇻",
    "version": "E2.0",
    "description": "flag: Cape Verde"
  },
  {
    "code_point": "1F1E8 1F1FC",
    "status": "fully-qualified",
    "icon": "🇨🇼",
    "version": "E2.0",
    "description": "flag: Curaçao"
  },
  {
    "code_point": "1F1E8 1F1FD",
    "status": "fully-qualified",
    "icon": "🇨🇽",
    "version": "E2.0",
    "description": "flag: Christmas Island"
  },
  {
    "code_point": "1F1E8 1F1FE",
    "status": "fully-qualified",
    "icon": "🇨🇾",
    "version": "E2.0",
    "description": "flag: Cyprus"
  },
  {
    "code_point": "1F1E8 1F1FF",
    "status": "fully-qualified",
    "icon": "🇨🇿",
    "version": "E2.0",
    "description": "flag: Czechia"
  },
  {
    "code_point": "1F1E9 1F1EA",
    "status": "fully-qualified",
    "icon": "🇩🇪",
    "version": "E0.6",
    "description": "flag: Germany"
  },
  {
    "code_point": "1F1E9 1F1EC",
    "status": "fully-qualified",
    "icon": "🇩🇬",
    "version": "E2.0",
    "description": "flag: Diego Garcia"
  },
  {
    "code_point": "1F1E9 1F1EF",
    "status": "fully-qualified",
    "icon": "🇩🇯",
    "version": "E2.0",
    "description": "flag: Djibouti"
  },
  {
    "code_point": "1F1E9 1F1F0",
    "status": "fully-qualified",
    "icon": "🇩🇰",
    "version": "E2.0",
    "description": "flag: Denmark"
  },
  {
    "code_point": "1F1E9 1F1F2",
    "status": "fully-qualified",
    "icon": "🇩🇲",
    "version": "E2.0",
    "description": "flag: Dominica"
  },
  {
    "code_point": "1F1E9 1F1F4",
    "status": "fully-qualified",
    "icon": "🇩🇴",
    "version": "E2.0",
    "description": "flag: Dominican Republic"
  },
  {
    "code_point": "1F1E9 1F1FF",
    "status": "fully-qualified",
    "icon": "🇩🇿",
    "version": "E2.0",
    "description": "flag: Algeria"
  },
  {
    "code_point": "1F1EA 1F1E6",
    "status": "fully-qualified",
    "icon": "🇪🇦",
    "version": "E2.0",
    "description": "flag: Ceuta & Melilla"
  },
  {
    "code_point": "1F1EA 1F1E8",
    "status": "fully-qualified",
    "icon": "🇪🇨",
    "version": "E2.0",
    "description": "flag: Ecuador"
  },
  {
    "code_point": "1F1EA 1F1EA",
    "status": "fully-qualified",
    "icon": "🇪🇪",
    "version": "E2.0",
    "description": "flag: Estonia"
  },
  {
    "code_point": "1F1EA 1F1EC",
    "status": "fully-qualified",
    "icon": "🇪🇬",
    "version": "E2.0",
    "description": "flag: Egypt"
  },
  {
    "code_point": "1F1EA 1F1ED",
    "status": "fully-qualified",
    "icon": "🇪🇭",
    "version": "E2.0",
    "description": "flag: Western Sahara"
  },
  {
    "code_point": "1F1EA 1F1F7",
    "status": "fully-qualified",
    "icon": "🇪🇷",
    "version": "E2.0",
    "description": "flag: Eritrea"
  },
  {
    "code_point": "1F1EA 1F1F8",
    "status": "fully-qualified",
    "icon": "🇪🇸",
    "version": "E0.6",
    "description": "flag: Spain"
  },
  {
    "code_point": "1F1EA 1F1F9",
    "status": "fully-qualified",
    "icon": "🇪🇹",
    "version": "E2.0",
    "description": "flag: Ethiopia"
  },
  {
    "code_point": "1F1EA 1F1FA",
    "status": "fully-qualified",
    "icon": "🇪🇺",
    "version": "E2.0",
    "description": "flag: European Union"
  },
  {
    "code_point": "1F1EB 1F1EE",
    "status": "fully-qualified",
    "icon": "🇫🇮",
    "version": "E2.0",
    "description": "flag: Finland"
  },
  {
    "code_point": "1F1EB 1F1EF",
    "status": "fully-qualified",
    "icon": "🇫🇯",
    "version": "E2.0",
    "description": "flag: Fiji"
  },
  {
    "code_point": "1F1EB 1F1F0",
    "status": "fully-qualified",
    "icon": "🇫🇰",
    "version": "E2.0",
    "description": "flag: Falkland Islands"
  },
  {
    "code_point": "1F1EB 1F1F2",
    "status": "fully-qualified",
    "icon": "🇫🇲",
    "version": "E2.0",
    "description": "flag: Micronesia"
  },
  {
    "code_point": "1F1EB 1F1F4",
    "status": "fully-qualified",
    "icon": "🇫🇴",
    "version": "E2.0",
    "description": "flag: Faroe Islands"
  },
  {
    "code_point": "1F1EB 1F1F7",
    "status": "fully-qualified",
    "icon": "🇫🇷",
    "version": "E0.6",
    "description": "flag: France"
  },
  {
    "code_point": "1F1EC 1F1E6",
    "status": "fully-qualified",
    "icon": "🇬🇦",
    "version": "E2.0",
    "description": "flag: Gabon"
  },
  {
    "code_point": "1F1EC 1F1E7",
    "status": "fully-qualified",
    "icon": "🇬🇧",
    "version": "E0.6",
    "description": "flag: United Kingdom"
  },
  {
    "code_point": "1F1EC 1F1E9",
    "status": "fully-qualified",
    "icon": "🇬🇩",
    "version": "E2.0",
    "description": "flag: Grenada"
  },
  {
    "code_point": "1F1EC 1F1EA",
    "status": "fully-qualified",
    "icon": "🇬🇪",
    "version": "E2.0",
    "description": "flag: Georgia"
  },
  {
    "code_point": "1F1EC 1F1EB",
    "status": "fully-qualified",
    "icon": "🇬🇫",
    "version": "E2.0",
    "description": "flag: French Guiana"
  },
  {
    "code_point": "1F1EC 1F1EC",
    "status": "fully-qualified",
    "icon": "🇬🇬",
    "version": "E2.0",
    "description": "flag: Guernsey"
  },
  {
    "code_point": "1F1EC 1F1ED",
    "status": "fully-qualified",
    "icon": "🇬🇭",
    "version": "E2.0",
    "description": "flag: Ghana"
  },
  {
    "code_point": "1F1EC 1F1EE",
    "status": "fully-qualified",
    "icon": "🇬🇮",
    "version": "E2.0",
    "description": "flag: Gibraltar"
  },
  {
    "code_point": "1F1EC 1F1F1",
    "status": "fully-qualified",
    "icon": "🇬🇱",
    "version": "E2.0",
    "description": "flag: Greenland"
  },
  {
    "code_point": "1F1EC 1F1F2",
    "status": "fully-qualified",
    "icon": "🇬🇲",
    "version": "E2.0",
    "description": "flag: Gambia"
  },
  {
    "code_point": "1F1EC 1F1F3",
    "status": "fully-qualified",
    "icon": "🇬🇳",
    "version": "E2.0",
    "description": "flag: Guinea"
  },
  {
    "code_point": "1F1EC 1F1F5",
    "status": "fully-qualified",
    "icon": "🇬🇵",
    "version": "E2.0",
    "description": "flag: Guadeloupe"
  },
  {
    "code_point": "1F1EC 1F1F6",
    "status": "fully-qualified",
    "icon": "🇬🇶",
    "version": "E2.0",
    "description": "flag: Equatorial Guinea"
  },
  {
    "code_point": "1F1EC 1F1F7",
    "status": "fully-qualified",
    "icon": "🇬🇷",
    "version": "E2.0",
    "description": "flag: Greece"
  },
  {
    "code_point": "1F1EC 1F1F8",
    "status": "fully-qualified",
    "icon": "🇬🇸",
    "version": "E2.0",
    "description": "flag: South Georgia & South Sandwich Islands"
  },
  {
    "code_point": "1F1EC 1F1F9",
    "status": "fully-qualified",
    "icon": "🇬🇹",
    "version": "E2.0",
    "description": "flag: Guatemala"
  },
  {
    "code_point": "1F1EC 1F1FA",
    "status": "fully-qualified",
    "icon": "🇬🇺",
    "version": "E2.0",
    "description": "flag: Guam"
  },
  {
    "code_point": "1F1EC 1F1FC",
    "status": "fully-qualified",
    "icon": "🇬🇼",
    "version": "E2.0",
    "description": "flag: Guinea-Bissau"
  },
  {
    "code_point": "1F1EC 1F1FE",
    "status": "fully-qualified",
    "icon": "🇬🇾",
    "version": "E2.0",
    "description": "flag: Guyana"
  },
  {
    "code_point": "1F1ED 1F1F0",
    "status": "fully-qualified",
    "icon": "🇭🇰",
    "version": "E2.0",
    "description": "flag: Hong Kong SAR China"
  },
  {
    "code_point": "1F1ED 1F1F2",
    "status": "fully-qualified",
    "icon": "🇭🇲",
    "version": "E2.0",
    "description": "flag: Heard & McDonald Islands"
  },
  {
    "code_point": "1F1ED 1F1F3",
    "status": "fully-qualified",
    "icon": "🇭🇳",
    "version": "E2.0",
    "description": "flag: Honduras"
  },
  {
    "code_point": "1F1ED 1F1F7",
    "status": "fully-qualified",
    "icon": "🇭🇷",
    "version": "E2.0",
    "description": "flag: Croatia"
  },
  {
    "code_point": "1F1ED 1F1F9",
    "status": "fully-qualified",
    "icon": "🇭🇹",
    "version": "E2.0",
    "description": "flag: Haiti"
  },
  {
    "code_point": "1F1ED 1F1FA",
    "status": "fully-qualified",
    "icon": "🇭🇺",
    "version": "E2.0",
    "description": "flag: Hungary"
  },
  {
    "code_point": "1F1EE 1F1E8",
    "status": "fully-qualified",
    "icon": "🇮🇨",
    "version": "E2.0",
    "description": "flag: Canary Islands"
  },
  {
    "code_point": "1F1EE 1F1E9",
    "status": "fully-qualified",
    "icon": "🇮🇩",
    "version": "E2.0",
    "description": "flag: Indonesia"
  },
  {
    "code_point": "1F1EE 1F1EA",
    "status": "fully-qualified",
    "icon": "🇮🇪",
    "version": "E2.0",
    "description": "flag: Ireland"
  },
  {
    "code_point": "1F1EE 1F1F1",
    "status": "fully-qualified",
    "icon": "🇮🇱",
    "version": "E2.0",
    "description": "flag: Israel"
  },
  {
    "code_point": "1F1EE 1F1F2",
    "status": "fully-qualified",
    "icon": "🇮🇲",
    "version": "E2.0",
    "description": "flag: Isle of Man"
  },
  {
    "code_point": "1F1EE 1F1F3",
    "status": "fully-qualified",
    "icon": "🇮🇳",
    "version": "E2.0",
    "description": "flag: India"
  },
  {
    "code_point": "1F1EE 1F1F4",
    "status": "fully-qualified",
    "icon": "🇮🇴",
    "version": "E2.0",
    "description": "flag: British Indian Ocean Territory"
  },
  {
    "code_point": "1F1EE 1F1F6",
    "status": "fully-qualified",
    "icon": "🇮🇶",
    "version": "E2.0",
    "description": "flag: Iraq"
  },
  {
    "code_point": "1F1EE 1F1F7",
    "status": "fully-qualified",
    "icon": "🇮🇷",
    "version": "E2.0",
    "description": "flag: Iran"
  },
  {
    "code_point": "1F1EE 1F1F8",
    "status": "fully-qualified",
    "icon": "🇮🇸",
    "version": "E2.0",
    "description": "flag: Iceland"
  },
  {
    "code_point": "1F1EE 1F1F9",
    "status": "fully-qualified",
    "icon": "🇮🇹",
    "version": "E0.6",
    "description": "flag: Italy"
  },
  {
    "code_point": "1F1EF 1F1EA",
    "status": "fully-qualified",
    "icon": "🇯🇪",
    "version": "E2.0",
    "description": "flag: Jersey"
  },
  {
    "code_point": "1F1EF 1F1F2",
    "status": "fully-qualified",
    "icon": "🇯🇲",
    "version": "E2.0",
    "description": "flag: Jamaica"
  },
  {
    "code_point": "1F1EF 1F1F4",
    "status": "fully-qualified",
    "icon": "🇯🇴",
    "version": "E2.0",
    "description": "flag: Jordan"
  },
  {
    "code_point": "1F1EF 1F1F5",
    "status": "fully-qualified",
    "icon": "🇯🇵",
    "version": "E0.6",
    "description": "flag: Japan"
  },
  {
    "code_point": "1F1F0 1F1EA",
    "status": "fully-qualified",
    "icon": "🇰🇪",
    "version": "E2.0",
    "description": "flag: Kenya"
  },
  {
    "code_point": "1F1F0 1F1EC",
    "status": "fully-qualified",
    "icon": "🇰🇬",
    "version": "E2.0",
    "description": "flag: Kyrgyzstan"
  },
  {
    "code_point": "1F1F0 1F1ED",
    "status": "fully-qualified",
    "icon": "🇰🇭",
    "version": "E2.0",
    "description": "flag: Cambodia"
  },
  {
    "code_point": "1F1F0 1F1EE",
    "status": "fully-qualified",
    "icon": "🇰🇮",
    "version": "E2.0",
    "description": "flag: Kiribati"
  },
  {
    "code_point": "1F1F0 1F1F2",
    "status": "fully-qualified",
    "icon": "🇰🇲",
    "version": "E2.0",
    "description": "flag: Comoros"
  },
  {
    "code_point": "1F1F0 1F1F3",
    "status": "fully-qualified",
    "icon": "🇰🇳",
    "version": "E2.0",
    "description": "flag: St. Kitts & Nevis"
  },
  {
    "code_point": "1F1F0 1F1F5",
    "status": "fully-qualified",
    "icon": "🇰🇵",
    "version": "E2.0",
    "description": "flag: North Korea"
  },
  {
    "code_point": "1F1F0 1F1F7",
    "status": "fully-qualified",
    "icon": "🇰🇷",
    "version": "E0.6",
    "description": "flag: South Korea"
  },
  {
    "code_point": "1F1F0 1F1FC",
    "status": "fully-qualified",
    "icon": "🇰🇼",
    "version": "E2.0",
    "description": "flag: Kuwait"
  },
  {
    "code_point": "1F1F0 1F1FE",
    "status": "fully-qualified",
    "icon": "🇰🇾",
    "version": "E2.0",
    "description": "flag: Cayman Islands"
  },
  {
    "code_point": "1F1F0 1F1FF",
    "status": "fully-qualified",
    "icon": "🇰🇿",
    "version": "E2.0",
    "description": "flag: Kazakhstan"
  },
  {
    "code_point": "1F1F1 1F1E6",
    "status": "fully-qualified",
    "icon": "🇱🇦",
    "version": "E2.0",
    "description": "flag: Laos"
  },
  {
    "code_point": "1F1F1 1F1E7",
    "status": "fully-qualified",
    "icon": "🇱🇧",
    "version": "E2.0",
    "description": "flag: Lebanon"
  },
  {
    "code_point": "1F1F1 1F1E8",
    "status": "fully-qualified",
    "icon": "🇱🇨",
    "version": "E2.0",
    "description": "flag: St. Lucia"
  },
  {
    "code_point": "1F1F1 1F1EE",
    "status": "fully-qualified",
    "icon": "🇱🇮",
    "version": "E2.0",
    "description": "flag: Liechtenstein"
  },
  {
    "code_point": "1F1F1 1F1F0",
    "status": "fully-qualified",
    "icon": "🇱🇰",
    "version": "E2.0",
    "description": "flag: Sri Lanka"
  },
  {
    "code_point": "1F1F1 1F1F7",
    "status": "fully-qualified",
    "icon": "🇱🇷",
    "version": "E2.0",
    "description": "flag: Liberia"
  },
  {
    "code_point": "1F1F1 1F1F8",
    "status": "fully-qualified",
    "icon": "🇱🇸",
    "version": "E2.0",
    "description": "flag: Lesotho"
  },
  {
    "code_point": "1F1F1 1F1F9",
    "status": "fully-qualified",
    "icon": "🇱🇹",
    "version": "E2.0",
    "description": "flag: Lithuania"
  },
  {
    "code_point": "1F1F1 1F1FA",
    "status": "fully-qualified",
    "icon": "🇱🇺",
    "version": "E2.0",
    "description": "flag: Luxembourg"
  },
  {
    "code_point": "1F1F1 1F1FB",
    "status": "fully-qualified",
    "icon": "🇱🇻",
    "version": "E2.0",
    "description": "flag: Latvia"
  },
  {
    "code_point": "1F1F1 1F1FE",
    "status": "fully-qualified",
    "icon": "🇱🇾",
    "version": "E2.0",
    "description": "flag: Libya"
  },
  {
    "code_point": "1F1F2 1F1E6",
    "status": "fully-qualified",
    "icon": "🇲🇦",
    "version": "E2.0",
    "description": "flag: Morocco"
  },
  {
    "code_point": "1F1F2 1F1E8",
    "status": "fully-qualified",
    "icon": "🇲🇨",
    "version": "E2.0",
    "description": "flag: Monaco"
  },
  {
    "code_point": "1F1F2 1F1E9",
    "status": "fully-qualified",
    "icon": "🇲🇩",
    "version": "E2.0",
    "description": "flag: Moldova"
  },
  {
    "code_point": "1F1F2 1F1EA",
    "status": "fully-qualified",
    "icon": "🇲🇪",
    "version": "E2.0",
    "description": "flag: Montenegro"
  },
  {
    "code_point": "1F1F2 1F1EB",
    "status": "fully-qualified",
    "icon": "🇲🇫",
    "version": "E2.0",
    "description": "flag: St. Martin"
  },
  {
    "code_point": "1F1F2 1F1EC",
    "status": "fully-qualified",
    "icon": "🇲🇬",
    "version": "E2.0",
    "description": "flag: Madagascar"
  },
  {
    "code_point": "1F1F2 1F1ED",
    "status": "fully-qualified",
    "icon": "🇲🇭",
    "version": "E2.0",
    "description": "flag: Marshall Islands"
  },
  {
    "code_point": "1F1F2 1F1F0",
    "status": "fully-qualified",
    "icon": "🇲🇰",
    "version": "E2.0",
    "description": "flag: North Macedonia"
  },
  {
    "code_point": "1F1F2 1F1F1",
    "status": "fully-qualified",
    "icon": "🇲🇱",
    "version": "E2.0",
    "description": "flag: Mali"
  },
  {
    "code_point": "1F1F2 1F1F2",
    "status": "fully-qualified",
    "icon": "🇲🇲",
    "version": "E2.0",
    "description": "flag: Myanmar (Burma)"
  },
  {
    "code_point": "1F1F2 1F1F3",
    "status": "fully-qualified",
    "icon": "🇲🇳",
    "version": "E2.0",
    "description": "flag: Mongolia"
  },
  {
    "code_point": "1F1F2 1F1F4",
    "status": "fully-qualified",
    "icon": "🇲🇴",
    "version": "E2.0",
    "description": "flag: Macao SAR China"
  },
  {
    "code_point": "1F1F2 1F1F5",
    "status": "fully-qualified",
    "icon": "🇲🇵",
    "version": "E2.0",
    "description": "flag: Northern Mariana Islands"
  },
  {
    "code_point": "1F1F2 1F1F6",
    "status": "fully-qualified",
    "icon": "🇲🇶",
    "version": "E2.0",
    "description": "flag: Martinique"
  },
  {
    "code_point": "1F1F2 1F1F7",
    "status": "fully-qualified",
    "icon": "🇲🇷",
    "version": "E2.0",
    "description": "flag: Mauritania"
  },
  {
    "code_point": "1F1F2 1F1F8",
    "status": "fully-qualified",
    "icon": "🇲🇸",
    "version": "E2.0",
    "description": "flag: Montserrat"
  },
  {
    "code_point": "1F1F2 1F1F9",
    "status": "fully-qualified",
    "icon": "🇲🇹",
    "version": "E2.0",
    "description": "flag: Malta"
  },
  {
    "code_point": "1F1F2 1F1FA",
    "status": "fully-qualified",
    "icon": "🇲🇺",
    "version": "E2.0",
    "description": "flag: Mauritius"
  },
  {
    "code_point": "1F1F2 1F1FB",
    "status": "fully-qualified",
    "icon": "🇲🇻",
    "version": "E2.0",
    "description": "flag: Maldives"
  },
  {
    "code_point": "1F1F2 1F1FC",
    "status": "fully-qualified",
    "icon": "🇲🇼",
    "version": "E2.0",
    "description": "flag: Malawi"
  },
  {
    "code_point": "1F1F2 1F1FD",
    "status": "fully-qualified",
    "icon": "🇲🇽",
    "version": "E2.0",
    "description": "flag: Mexico"
  },
  {
    "code_point": "1F1F2 1F1FE",
    "status": "fully-qualified",
    "icon": "🇲🇾",
    "version": "E2.0",
    "description": "flag: Malaysia"
  },
  {
    "code_point": "1F1F2 1F1FF",
    "status": "fully-qualified",
    "icon": "🇲🇿",
    "version": "E2.0",
    "description": "flag: Mozambique"
  },
  {
    "code_point": "1F1F3 1F1E6",
    "status": "fully-qualified",
    "icon": "🇳🇦",
    "version": "E2.0",
    "description": "flag: Namibia"
  },
  {
    "code_point": "1F1F3 1F1E8",
    "status": "fully-qualified",
    "icon": "🇳🇨",
    "version": "E2.0",
    "description": "flag: New Caledonia"
  },
  {
    "code_point": "1F1F3 1F1EA",
    "status": "fully-qualified",
    "icon": "🇳🇪",
    "version": "E2.0",
    "description": "flag: Niger"
  },
  {
    "code_point": "1F1F3 1F1EB",
    "status": "fully-qualified",
    "icon": "🇳🇫",
    "version": "E2.0",
    "description": "flag: Norfolk Island"
  },
  {
    "code_point": "1F1F3 1F1EC",
    "status": "fully-qualified",
    "icon": "🇳🇬",
    "version": "E2.0",
    "description": "flag: Nigeria"
  },
  {
    "code_point": "1F1F3 1F1EE",
    "status": "fully-qualified",
    "icon": "🇳🇮",
    "version": "E2.0",
    "description": "flag: Nicaragua"
  },
  {
    "code_point": "1F1F3 1F1F1",
    "status": "fully-qualified",
    "icon": "🇳🇱",
    "version": "E2.0",
    "description": "flag: Netherlands"
  },
  {
    "code_point": "1F1F3 1F1F4",
    "status": "fully-qualified",
    "icon": "🇳🇴",
    "version": "E2.0",
    "description": "flag: Norway"
  },
  {
    "code_point": "1F1F3 1F1F5",
    "status": "fully-qualified",
    "icon": "🇳🇵",
    "version": "E2.0",
    "description": "flag: Nepal"
  },
  {
    "code_point": "1F1F3 1F1F7",
    "status": "fully-qualified",
    "icon": "🇳🇷",
    "version": "E2.0",
    "description": "flag: Nauru"
  },
  {
    "code_point": "1F1F3 1F1FA",
    "status": "fully-qualified",
    "icon": "🇳🇺",
    "version": "E2.0",
    "description": "flag: Niue"
  },
  {
    "code_point": "1F1F3 1F1FF",
    "status": "fully-qualified",
    "icon": "🇳🇿",
    "version": "E2.0",
    "description": "flag: New Zealand"
  },
  {
    "code_point": "1F1F4 1F1F2",
    "status": "fully-qualified",
    "icon": "🇴🇲",
    "version": "E2.0",
    "description": "flag: Oman"
  },
  {
    "code_point": "1F1F5 1F1E6",
    "status": "fully-qualified",
    "icon": "🇵🇦",
    "version": "E2.0",
    "description": "flag: Panama"
  },
  {
    "code_point": "1F1F5 1F1EA",
    "status": "fully-qualified",
    "icon": "🇵🇪",
    "version": "E2.0",
    "description": "flag: Peru"
  },
  {
    "code_point": "1F1F5 1F1EB",
    "status": "fully-qualified",
    "icon": "🇵🇫",
    "version": "E2.0",
    "description": "flag: French Polynesia"
  },
  {
    "code_point": "1F1F5 1F1EC",
    "status": "fully-qualified",
    "icon": "🇵🇬",
    "version": "E2.0",
    "description": "flag: Papua New Guinea"
  },
  {
    "code_point": "1F1F5 1F1ED",
    "status": "fully-qualified",
    "icon": "🇵🇭",
    "version": "E2.0",
    "description": "flag: Philippines"
  },
  {
    "code_point": "1F1F5 1F1F0",
    "status": "fully-qualified",
    "icon": "🇵🇰",
    "version": "E2.0",
    "description": "flag: Pakistan"
  },
  {
    "code_point": "1F1F5 1F1F1",
    "status": "fully-qualified",
    "icon": "🇵🇱",
    "version": "E2.0",
    "description": "flag: Poland"
  },
  {
    "code_point": "1F1F5 1F1F2",
    "status": "fully-qualified",
    "icon": "🇵🇲",
    "version": "E2.0",
    "description": "flag: St. Pierre & Miquelon"
  },
  {
    "code_point": "1F1F5 1F1F3",
    "status": "fully-qualified",
    "icon": "🇵🇳",
    "version": "E2.0",
    "description": "flag: Pitcairn Islands"
  },
  {
    "code_point": "1F1F5 1F1F7",
    "status": "fully-qualified",
    "icon": "🇵🇷",
    "version": "E2.0",
    "description": "flag: Puerto Rico"
  },
  {
    "code_point": "1F1F5 1F1F8",
    "status": "fully-qualified",
    "icon": "🇵🇸",
    "version": "E2.0",
    "description": "flag: Palestinian Territories"
  },
  {
    "code_point": "1F1F5 1F1F9",
    "status": "fully-qualified",
    "icon": "🇵🇹",
    "version": "E2.0",
    "description": "flag: Portugal"
  },
  {
    "code_point": "1F1F5 1F1FC",
    "status": "fully-qualified",
    "icon": "🇵🇼",
    "version": "E2.0",
    "description": "flag: Palau"
  },
  {
    "code_point": "1F1F5 1F1FE",
    "status": "fully-qualified",
    "icon": "🇵🇾",
    "version": "E2.0",
    "description": "flag: Paraguay"
  },
  {
    "code_point": "1F1F6 1F1E6",
    "status": "fully-qualified",
    "icon": "🇶🇦",
    "version": "E2.0",
    "description": "flag: Qatar"
  },
  {
    "code_point": "1F1F7 1F1EA",
    "status": "fully-qualified",
    "icon": "🇷🇪",
    "version": "E2.0",
    "description": "flag: Réunion"
  },
  {
    "code_point": "1F1F7 1F1F4",
    "status": "fully-qualified",
    "icon": "🇷🇴",
    "version": "E2.0",
    "description": "flag: Romania"
  },
  {
    "code_point": "1F1F7 1F1F8",
    "status": "fully-qualified",
    "icon": "🇷🇸",
    "version": "E2.0",
    "description": "flag: Serbia"
  },
  {
    "code_point": "1F1F7 1F1FA",
    "status": "fully-qualified",
    "icon": "🇷🇺",
    "version": "E0.6",
    "description": "flag: Russia"
  },
  {
    "code_point": "1F1F7 1F1FC",
    "status": "fully-qualified",
    "icon": "🇷🇼",
    "version": "E2.0",
    "description": "flag: Rwanda"
  },
  {
    "code_point": "1F1F8 1F1E6",
    "status": "fully-qualified",
    "icon": "🇸🇦",
    "version": "E2.0",
    "description": "flag: Saudi Arabia"
  },
  {
    "code_point": "1F1F8 1F1E7",
    "status": "fully-qualified",
    "icon": "🇸🇧",
    "version": "E2.0",
    "description": "flag: Solomon Islands"
  },
  {
    "code_point": "1F1F8 1F1E8",
    "status": "fully-qualified",
    "icon": "🇸🇨",
    "version": "E2.0",
    "description": "flag: Seychelles"
  },
  {
    "code_point": "1F1F8 1F1E9",
    "status": "fully-qualified",
    "icon": "🇸🇩",
    "version": "E2.0",
    "description": "flag: Sudan"
  },
  {
    "code_point": "1F1F8 1F1EA",
    "status": "fully-qualified",
    "icon": "🇸🇪",
    "version": "E2.0",
    "description": "flag: Sweden"
  },
  {
    "code_point": "1F1F8 1F1EC",
    "status": "fully-qualified",
    "icon": "🇸🇬",
    "version": "E2.0",
    "description": "flag: Singapore"
  },
  {
    "code_point": "1F1F8 1F1ED",
    "status": "fully-qualified",
    "icon": "🇸🇭",
    "version": "E2.0",
    "description": "flag: St. Helena"
  },
  {
    "code_point": "1F1F8 1F1EE",
    "status": "fully-qualified",
    "icon": "🇸🇮",
    "version": "E2.0",
    "description": "flag: Slovenia"
  },
  {
    "code_point": "1F1F8 1F1EF",
    "status": "fully-qualified",
    "icon": "🇸🇯",
    "version": "E2.0",
    "description": "flag: Svalbard & Jan Mayen"
  },
  {
    "code_point": "1F1F8 1F1F0",
    "status": "fully-qualified",
    "icon": "🇸🇰",
    "version": "E2.0",
    "description": "flag: Slovakia"
  },
  {
    "code_point": "1F1F8 1F1F1",
    "status": "fully-qualified",
    "icon": "🇸🇱",
    "version": "E2.0",
    "description": "flag: Sierra Leone"
  },
  {
    "code_point": "1F1F8 1F1F2",
    "status": "fully-qualified",
    "icon": "🇸🇲",
    "version": "E2.0",
    "description": "flag: San Marino"
  },
  {
    "code_point": "1F1F8 1F1F3",
    "status": "fully-qualified",
    "icon": "🇸🇳",
    "version": "E2.0",
    "description": "flag: Senegal"
  },
  {
    "code_point": "1F1F8 1F1F4",
    "status": "fully-qualified",
    "icon": "🇸🇴",
    "version": "E2.0",
    "description": "flag: Somalia"
  },
  {
    "code_point": "1F1F8 1F1F7",
    "status": "fully-qualified",
    "icon": "🇸🇷",
    "version": "E2.0",
    "description": "flag: Suriname"
  },
  {
    "code_point": "1F1F8 1F1F8",
    "status": "fully-qualified",
    "icon": "🇸🇸",
    "version": "E2.0",
    "description": "flag: South Sudan"
  },
  {
    "code_point": "1F1F8 1F1F9",
    "status": "fully-qualified",
    "icon": "🇸🇹",
    "version": "E2.0",
    "description": "flag: São Tomé & Príncipe"
  },
  {
    "code_point": "1F1F8 1F1FB",
    "status": "fully-qualified",
    "icon": "🇸🇻",
    "version": "E2.0",
    "description": "flag: El Salvador"
  },
  {
    "code_point": "1F1F8 1F1FD",
    "status": "fully-qualified",
    "icon": "🇸🇽",
    "version": "E2.0",
    "description": "flag: Sint Maarten"
  },
  {
    "code_point": "1F1F8 1F1FE",
    "status": "fully-qualified",
    "icon": "🇸🇾",
    "version": "E2.0",
    "description": "flag: Syria"
  },
  {
    "code_point": "1F1F8 1F1FF",
    "status": "fully-qualified",
    "icon": "🇸🇿",
    "version": "E2.0",
    "description": "flag: Eswatini"
  },
  {
    "code_point": "1F1F9 1F1E6",
    "status": "fully-qualified",
    "icon": "🇹🇦",
    "version": "E2.0",
    "description": "flag: Tristan da Cunha"
  },
  {
    "code_point": "1F1F9 1F1E8",
    "status": "fully-qualified",
    "icon": "🇹🇨",
    "version": "E2.0",
    "description": "flag: Turks & Caicos Islands"
  },
  {
    "code_point": "1F1F9 1F1E9",
    "status": "fully-qualified",
    "icon": "🇹🇩",
    "version": "E2.0",
    "description": "flag: Chad"
  },
  {
    "code_point": "1F1F9 1F1EB",
    "status": "fully-qualified",
    "icon": "🇹🇫",
    "version": "E2.0",
    "description": "flag: French Southern Territories"
  },
  {
    "code_point": "1F1F9 1F1EC",
    "status": "fully-qualified",
    "icon": "🇹🇬",
    "version": "E2.0",
    "description": "flag: Togo"
  },
  {
    "code_point": "1F1F9 1F1ED",
    "status": "fully-qualified",
    "icon": "🇹🇭",
    "version": "E2.0",
    "description": "flag: Thailand"
  },
  {
    "code_point": "1F1F9 1F1EF",
    "status": "fully-qualified",
    "icon": "🇹🇯",
    "version": "E2.0",
    "description": "flag: Tajikistan"
  },
  {
    "code_point": "1F1F9 1F1F0",
    "status": "fully-qualified",
    "icon": "🇹🇰",
    "version": "E2.0",
    "description": "flag: Tokelau"
  },
  {
    "code_point": "1F1F9 1F1F1",
    "status": "fully-qualified",
    "icon": "🇹🇱",
    "version": "E2.0",
    "description": "flag: Timor-Leste"
  },
  {
    "code_point": "1F1F9 1F1F2",
    "status": "fully-qualified",
    "icon": "🇹🇲",
    "version": "E2.0",
    "description": "flag: Turkmenistan"
  },
  {
    "code_point": "1F1F9 1F1F3",
    "status": "fully-qualified",
    "icon": "🇹🇳",
    "version": "E2.0",
    "description": "flag: Tunisia"
  },
  {
    "code_point": "1F1F9 1F1F4",
    "status": "fully-qualified",
    "icon": "🇹🇴",
    "version": "E2.0",
    "description": "flag: Tonga"
  },
  {
    "code_point": "1F1F9 1F1F7",
    "status": "fully-qualified",
    "icon": "🇹🇷",
    "version": "E2.0",
    "description": "flag: Türkiye"
  },
  {
    "code_point": "1F1F9 1F1F9",
    "status": "fully-qualified",
    "icon": "🇹🇹",
    "version": "E2.0",
    "description": "flag: Trinidad & Tobago"
  },
  {
    "code_point": "1F1F9 1F1FB",
    "status": "fully-qualified",
    "icon": "🇹🇻",
    "version": "E2.0",
    "description": "flag: Tuvalu"
  },
  {
    "code_point": "1F1F9 1F1FC",
    "status": "fully-qualified",
    "icon": "🇹🇼",
    "version": "E2.0",
    "description": "flag: Taiwan"
  },
  {
    "code_point": "1F1F9 1F1FF",
    "status": "fully-qualified",
    "icon": "🇹🇿",
    "version": "E2.0",
    "description": "flag: Tanzania"
  },
  {
    "code_point": "1F1FA 1F1E6",
    "status": "fully-qualified",
    "icon": "🇺🇦",
    "version": "E2.0",
    "description": "flag: Ukraine"
  },
  {
    "code_point": "1F1FA 1F1EC",
    "status": "fully-qualified",
    "icon": "🇺🇬",
    "version": "E2.0",
    "description": "flag: Uganda"
  },
  {
    "code_point": "1F1FA 1F1F2",
    "status": "fully-qualified",
    "icon": "🇺🇲",
    "version": "E2.0",
    "description": "flag: U.S. Outlying Islands"
  },
  {
    "code_point": "1F1FA 1F1F3",
    "status": "fully-qualified",
    "icon": "🇺🇳",
    "version": "E4.0",
    "description": "flag: United Nations"
  },
  {
    "code_point": "1F1FA 1F1F8",
    "status": "fully-qualified",
    "icon": "🇺🇸",
    "version": "E0.6",
    "description": "flag: United States"
  },
  {
    "code_point": "1F1FA 1F1FE",
    "status": "fully-qualified",
    "icon": "🇺🇾",
    "version": "E2.0",
    "description": "flag: Uruguay"
  },
  {
    "code_point": "1F1FA 1F1FF",
    "status": "fully-qualified",
    "icon": "🇺🇿",
    "version": "E2.0",
    "description": "flag: Uzbekistan"
  },
  {
    "code_point": "1F1FB 1F1E6",
    "status": "fully-qualified",
    "icon": "🇻🇦",
    "version": "E2.0",
    "description": "flag: Vatican City"
  },
  {
    "code_point": "1F1FB 1F1E8",
    "status": "fully-qualified",
    "icon": "🇻🇨",
    "version": "E2.0",
    "description": "flag: St. Vincent & Grenadines"
  },
  {
    "code_point": "1F1FB 1F1EA",
    "status": "fully-qualified",
    "icon": "🇻🇪",
    "version": "E2.0",
    "description": "flag: Venezuela"
  },
  {
    "code_point": "1F1FB 1F1EC",
    "status": "fully-qualified",
    "icon": "🇻🇬",
    "version": "E2.0",
    "description": "flag: British Virgin Islands"
  },
  {
    "code_point": "1F1FB 1F1EE",
    "status": "fully-qualified",
    "icon": "🇻🇮",
    "version": "E2.0",
    "description": "flag: U.S. Virgin Islands"
  },
  {
    "code_point": "1F1FB 1F1F3",
    "status": "fully-qualified",
    "icon": "🇻🇳",
    "version": "E2.0",
    "description": "flag: Vietnam"
  },
  {
    "code_point": "1F1FB 1F1FA",
    "status": "fully-qualified",
    "icon": "🇻🇺",
    "version": "E2.0",
    "description": "flag: Vanuatu"
  },
  {
    "code_point": "1F1FC 1F1EB",
    "status": "fully-qualified",
    "icon": "🇼🇫",
    "version": "E2.0",
    "description": "flag: Wallis & Futuna"
  },
  {
    "code_point": "1F1FC 1F1F8",
    "status": "fully-qualified",
    "icon": "🇼🇸",
    "version": "E2.0",
    "description": "flag: Samoa"
  },
  {
    "code_point": "1F1FD 1F1F0",
    "status": "fully-qualified",
    "icon": "🇽🇰",
    "version": "E2.0",
    "description": "flag: Kosovo"
  },
  {
    "code_point": "1F1FE 1F1EA",
    "status": "fully-qualified",
    "icon": "🇾🇪",
    "version": "E2.0",
    "description": "flag: Yemen"
  },
  {
    "code_point": "1F1FE 1F1F9",
    "status": "fully-qualified",
    "icon": "🇾🇹",
    "version": "E2.0",
    "description": "flag: Mayotte"
  },
  {
    "code_point": "1F1FF 1F1E6",
    "status": "fully-qualified",
    "icon": "🇿🇦",
    "version": "E2.0",
    "description": "flag: South Africa"
  },
  {
    "code_point": "1F1FF 1F1F2",
    "status": "fully-qualified",
    "icon": "🇿🇲",
    "version": "E2.0",
    "description": "flag: Zambia"
  },
  {
    "code_point": "1F1FF 1F1FC",
    "status": "fully-qualified",
    "icon": "🇿🇼",
    "version": "E2.0",
    "description": "flag: Zimbabwe"
  },
  {
    "code_point": "1F3F4 E0067 E0062 E0065 E006E E0067 E007F",
    "status": "fully-qualified",
    "icon": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "version": "E5.0",
    "description": "flag: England"
  },
  {
    "code_point": "1F3F4 E0067 E0062 E0073 E0063 E0074 E007F",
    "status": "fully-qualified",
    "icon": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "version": "E5.0",
    "description": "flag: Scotland"
  },
  {
    "code_point": "1F3F4 E0067 E0062 E0077 E006C E0073 E007F",
    "status": "fully-qualified",
    "icon": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "version": "E5.0",
    "description": "flag: Wales"
  }
]