import { Readable } from "stream"
import { faker } from "@faker-js/faker"
import { FSDriver } from "@ordo-pink/backend-universal"
import { OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/common-types"
import { createDefaultS3Driver } from "."

const DIRECTORY: OrdoDirectoryPath = "/test-directory/"
const DIRECTORY_WITH_SUBDIRS1: OrdoDirectoryPath = "/test-directory-wsb/"
const DIRECTORY_WITH_SUBDIRS11: OrdoDirectoryPath = "/test-directory-wsb-1/"
const DIRECTORY_WITH_SUBDIRS2: OrdoDirectoryPath = "/test-directory-wsb/test/"
const DIRECTORY_WITH_SUBDIRS3: OrdoDirectoryPath = "/test-directory-wsb/test/must-be/"
const DIRECTORY_WITH_SUBDIRS4: OrdoDirectoryPath = "/test-directory-wsb/test/must-be/covered/"

// TODO: we must spy on inner driver function to cover out outer model
describe("S3 cloud storage tests", () => {
  let driver: FSDriver
  beforeEach(() => {
    jest.setTimeout(60000)
  })
  beforeAll(async () => {
    const endpoint = process.env.S3_DRIVER_TEST_AWS_STORAGE_ENDPOINT
    const bucketName = process.env.S3_DRIVER_TEST_AWS_BUCKET_NAME
    const region = process.env.S3_DRIVER_TEST_AWS_STORAGE_REGION
    const accessKeyId = process.env.S3_DRIVER_TEST_AWS_STORAGE_ACCESS_KEY
    const secretAccessKey = process.env.S3_DRIVER_TEST_AWS_STORAGE_SECRET_KEY

    if (!endpoint || !bucketName || !region || !accessKeyId || !secretAccessKey) {
      throw new Error("S3 driver test configuration is invalid")
    }

    driver = createDefaultS3Driver({
      endpoint,
      region,
      accessKeyId,
      secretAccessKey,
      bucketName,
    })

    await driver.deleteDirectory(DIRECTORY)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS4)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS3)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS2)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS1)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS11)
  })

  afterEach(async () => {
    await driver.deleteDirectory(DIRECTORY)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS4)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS3)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS2)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS1)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS11)
  })

  it("directory should not exist", async () => {
    const isExists = await driver.checkDirectoryExists(DIRECTORY)
    expect(isExists).toBeFalsy()
  })

  it("directory should be created and should be found", async () => {
    const dir = await driver.createDirectory(DIRECTORY)
    expect(dir).toBe(DIRECTORY)
    const isExists = await driver.checkDirectoryExists(DIRECTORY)
    expect(isExists).toBeTruthy()
  })

  it("directory should be created and should be deleted", async () => {
    const dir = await driver.createDirectory(DIRECTORY)
    expect(dir).toBe(DIRECTORY)
    let isExists = await driver.checkDirectoryExists(DIRECTORY)
    expect(isExists).toBeTruthy()
    await driver.deleteDirectory(DIRECTORY)
    isExists = await driver.checkDirectoryExists(DIRECTORY)
    expect(isExists).toBeFalsy()
  })

  it("directory with subdirectories should not exist", async () => {
    const isExists = await driver.checkDirectoryExists(DIRECTORY_WITH_SUBDIRS4)
    expect(isExists).toBeFalsy()
  })

  it("directory with subdirectories should be created and should be found", async () => {
    const dir = await driver.createDirectory(DIRECTORY_WITH_SUBDIRS4)
    expect(dir).toBe(DIRECTORY_WITH_SUBDIRS4)
    const isExists = await driver.checkDirectoryExists(DIRECTORY_WITH_SUBDIRS4)
    expect(isExists).toBeTruthy()
  })

  it("directory with subdirectories should be created and should be deleted", async () => {
    const dir = await driver.createDirectory(DIRECTORY_WITH_SUBDIRS4)
    expect(dir).toBe(DIRECTORY_WITH_SUBDIRS4)
    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS4)
    const isExists = await driver.checkDirectoryExists(DIRECTORY_WITH_SUBDIRS4)
    expect(isExists).toBeFalsy()
  })

  it("should create empty directory and might to download empty stub file", async () => {
    const dir = await driver.createDirectory(DIRECTORY)
    expect(dir).toBe(DIRECTORY)
    const isExists = await driver.checkDirectoryExists(DIRECTORY)
    expect(isExists).toBeTruthy()
    const file = await driver.getFile((DIRECTORY + ".fs.ignore") as OrdoFilePath)
    expect(file).toBeInstanceOf(Readable)
  })

  it("shold create several files", async () => {
    const paths: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS1}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )
    for (const path of paths) {
      await driver.createFile({ path })
    }

    const files = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS1)
    for (const file of files) {
      expect(paths).toContain(file)
    }
  })

  it("shold move directory with several files", async () => {
    const paths: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS1}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )

    const pathsNew: OrdoFilePath[] = paths.map((p) =>
      p.replace(DIRECTORY_WITH_SUBDIRS1, DIRECTORY_WITH_SUBDIRS11),
    ) as OrdoFilePath[]

    for (const path of paths) {
      await driver.createFile({ path })
    }

    let files = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS1)
    for (const file of files) {
      expect(paths).toContain(file)
    }

    await driver.moveDirectory({
      oldPath: DIRECTORY_WITH_SUBDIRS1,
      newPath: DIRECTORY_WITH_SUBDIRS11,
    })
    files = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS11)

    for (const file of files) {
      expect(pathsNew).toContain(file)
    }
  })

  it("should remove folder with several files in several directories - totally", async () => {
    const paths1: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS1}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )
    const paths2: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS2}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )
    const paths3: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS4}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )
    const paths = paths1.concat(paths2).concat(paths3)

    for (const path of paths) {
      await driver.createFile({ path })
    }
    const files1 = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS1)
    let files2 = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS2)
    let files3 = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS4)

    const files = files1.concat(files2).concat(files3)
    for (const file of files) {
      expect(
        paths.concat([
          DIRECTORY_WITH_SUBDIRS1,
          DIRECTORY_WITH_SUBDIRS2,
          DIRECTORY_WITH_SUBDIRS3,
          DIRECTORY_WITH_SUBDIRS4,
        ]),
      ).toContain(file)
    }

    await driver.deleteDirectory(DIRECTORY_WITH_SUBDIRS4)
    files3 = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS4)
    expect(files3).toHaveLength(0)
    for (const file of files2) {
      await driver.deleteFile(file)
    }
    files2 = await driver.getDirectoryChildren(DIRECTORY_WITH_SUBDIRS4)
    expect(files3).toHaveLength(0)
  })

  it("should make file and get his descriptor", async () => {
    const paths: OrdoFilePath[] = new Array(10)
      .fill({})
      .map(
        () =>
          `${DIRECTORY_WITH_SUBDIRS1}${faker.system.commonFileName()}.${faker.system.commonFileExt()}` as OrdoFilePath,
      )
    for (const path of paths) {
      await driver.createFile({ path })
    }

    const descriptors = await Promise.all(paths.map((path) => driver.getFileDescriptor(path)))

    expect(descriptors).toBeDefined()
  })
})
