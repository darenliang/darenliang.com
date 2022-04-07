---
title: "FUSEing for Fun"
date: "2022-03-26"
showthedate: true
---

<script async src="https://buttons.github.io/buttons.js"></script>

Something that I find absolutely fascinating
are [Filesystems in USErspace (FUSE)](https://en.wikipedia.org/wiki/Filesystem_in_Userspace).

### What is FUSE?

FUSE, to put it simply, allows people to implement filesystems in userspace. Filesystems are traditionally implemented in
the kernel, but when using FUSE, non-privileged programs can be used to create custom filesystems.

### Why is it cool?

Filesystems don't need to be concrete! You can implement virtual filesystems with little or no limitations.

* Don't want files to write to disk? Implement a "ramdisk" in FUSE.
* Want to use Amazon S3 as if it is a hard drive on your computer?
  Use [s3fs-fuse](https://github.com/s3fs-fuse/s3fs-fuse).
* Want to be evil 😈 and store files on Google sheets? Use
  [spreadsheetfs](https://github.com/GunshipPenguin/spreadsheetfs).

## Introducing dsfs

Dsfs is an experimental filesystem written in Go and backed by Discord attachments.

> :warning: **Use at your own risk!** This is an unfinished project and only
> for research or recreational purposes only.

It features an append-only filesystem that acts similarly to
a [log-structured filesystem](https://en.wikipedia.org/wiki/Log-structured_file_system).

There are two channels:

* \#tx: stores transaction data
* \#data: stores file data in 8MB chunks

<img src="/img/fuse/tx.png" width="400px" style="display: inline"><img src="/img/fuse/data.png" width="400px" style="display: inline">

### Transaction format

```go
type Tx struct {
	Tx        int       `json:"tx"`
	Type      int       `json:"type"`
	Path      string    `json:"path"`
	FileIDs   []string  `json:"ids"`
	Checksums []string  `json:"sums"`
	Size      int64     `json:"size"`
	Mtim      time.Time `json:"mtim"`
	Ctim      time.Time `json:"ctim"`
}
```

* Tx: 0 for write, 1 for delete
* Type: 0 for file, 1 for folder
* Path: absolute path of file or folder
* FileIDs: file ids for file data
* Checksums: SHA1 checksums for file ids
* Size: size of file in bytes
* Mtim: modification time of file
* Ctim: creation time of file

For example, the following json represents a transaction that creates a file with path `/test.mp4` with a size of ~35MB.

```json
{
  "tx": 0,
  "type": 0,
  "path": "/test.mp4",
  "ids": [
    "956040610224148480",
    "956040626284146698",
    "956040643749224478",
    "..."
  ],
  "sums": [
    "Y9Whjuk_kbopDYx7cdSHXrzApvk=",
    "sxFp01p0Q52hF-q8LWGi1DoXX-M=",
    "7PljyMpvTDE-cfaZtm532OTwG7U=",
    "..."
  ],
  "mtim": "2022-03-22T23:01:08.3596736-04:00",
  "ctim": "2022-03-22T23:01:07.9266501-04:00",
  "size": 348437445
}
```

### At Startup

All transactions are downloaded from the #tx channel and applied in sequential order in a radix tree structure.

Why in a radix tree structure?

Radix trees have fast prefix lookups which is beneficial for querying file and folder paths.

Startup times can get long when there is a long transaction history. To speed startup times multiple transactions can be
compacted into one message. Transaction order is still preserved and if no more transactions can fit in a message, the
transactions are compacted into the next message and so on.

### Opening a folder

The path is queried in the radix tree and the immediate children (files and folders) are listed along with basic
metadata such as size, modification/creation times, etc.

### Opening a file

A background process will load the file into memory. The first and last pieces (same behavior as BitTorrent) are
downloaded first so that certain applications are able to preview the file.

### Reading a file

Reading the file will incur almost no performance penalty as the file is fully buffered in memory. In the future, this
would preferably be changed so that the file is streamed with only part of the file buffered, but it may cause large
amounts of latency.

### Writing to a file

Writing to the file happens in memory. The changes are not immediately reflected on the remote filesystem as writes
often happen in small chunks.

### Closing a file

Each opened file has a dirty bit associated with it which is set to true when the file is modified in memory. Upon
closing the file, the dirty bit is checked and file data is uploaded. SHA1 checksums are used to ensure that there are no
unnecessary chunks uploads.

### Realtime synchronization

Syncing between clients occurs when a client sends a transaction in the #tx channel. Another client picks up the
transaction and applies it on their filesystem. When a file is already opened, SHA1 checksums are used to ensure that
only modified chunks are downloaded and patched.

### Automatic snapshots

Since the filesystem is append-only, each historic state of the filesystem is saved and can be recovered in the future
by replaying transactions up to a specific date and time.

### Cross-platform support

[Cgofuse](https://github.com/winfsp/cgofuse) is used which supports Windows, macOS and Linux.

The FUSE libraries required for each platform:

* Windows: [WinFsp](https://github.com/winfsp/winfsp)
* macOS: [macFUSE](https://osxfuse.github.io/)
* Linux: [libfuse](https://github.com/libfuse/libfuse)

## Areas of improvement

Renaming folders is horribly inefficient as it involves renaming all children. This issue can be solved by giving each
file/folder a permanent id and create a mapping between paths and ids.

When performing many operations at once, you can get ratelimited. This issue can be alleviated by running a connection
pool to artificially increase the ratelimits.

A lot of permissions and attributes are not implemented. In most systems, the size attribute is all that matters. Some
attributes such as access times is unfeasible to implement as the attribute would be stale most of the time.

## Basic Demo

<video width=100% controls>
    <source src="/media/fuse/demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

## Source code

<a class="github-button" href="https://github.com/darenliang/dsfs" data-size="large" aria-label="Visit dsfs on GitHub">
Visit dsfs on GitHub</a>
